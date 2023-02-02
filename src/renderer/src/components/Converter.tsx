import { Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getCanvasVideoRenderer } from '../class/renderer/renderer';
import { getFFMpeg, scaleVideo, transcodeToMp4 } from '../utils/FFMpeg';
import FileDownload from './FileDownload';
import { FileInfo } from './FileInfo';
import FileInput from './FileInput';
import VideoCanvas, { VideoCanvasRef } from './VideoCanvas';

export const Converter = () => {
  const [selectedVideo, setSelectedVideo] = useState<File[] | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>();
  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const [blob, setBlob] = useState<Blob>();
  const [status, setStatus] = useState('idle');

  const videoCanvasRef = useRef<VideoCanvasRef>(null);

  useEffect(() => {
    getFFMpeg({
      progress: ({ ratio: progress }) => {
        setStatus(`Transcoding ffmpeg... ${(100 * progress).toFixed(2)}%`);
      },
      log: true,
    });
  }, []);

  const onSelectVideo = (files: File[] | null) => {
    setSelectedVideo(files);
    if (files) {
      setVideoSrc(URL.createObjectURL(files[0]));
    }
  };

  const handleSelectOverlay = (files: File[] | null) => {
    setImageSrc([...imageSrc, ...(files?.map((file) => URL.createObjectURL(file)) ?? [])]);
  };

  const handleTranscode = async () => {
    if (selectedVideo) {
      setStatus('Transcoding...');
      setBlob(await transcodeToMp4(selectedVideo[0]));
    }
  };

  const handleScale = async () => {
    if (selectedVideo) {
      setStatus('Scaling...');
      setBlob(await scaleVideo(selectedVideo[0]));
    }
  };

  const fileInfo = selectedVideo ? <FileInfo file={selectedVideo[0]} /> : null;

  return (
    <Flex align='center' justifyContent='center' direction='column' gap={6}>
      {fileInfo}
      {videoSrc && <VideoCanvas ref={videoCanvasRef} overlaySrc={imageSrc} videoSrc={videoSrc} />}
      <Text>{status}</Text>
      <Flex align='center' justifyContent='center' gap={4}>
        <FileInput onSelect={onSelectVideo} label='Select Video' />
        <FileInput onSelect={handleSelectOverlay} label='Add Picture' />
        <Button disabled={selectedVideo === null} onClick={handleTranscode}>
          Transcode
        </Button>
        <Button disabled={selectedVideo === null} onClick={handleScale}>
          Scale
        </Button>
        <Button
          disabled={selectedVideo === null}
          onClick={() => {
            if (videoCanvasRef.current?.canvas && videoCanvasRef.current?.video)
              handleRender(
                videoCanvasRef.current.canvas,
                videoCanvasRef.current.video,
                imageSrc,
                (frameNum, timeMS) => {
                  setStatus(
                    `${(frameNum / (timeMS / 1000)).toFixed(
                      2,
                    )} frames / sec. total ${frameNum} frames processed`,
                  );
                },
              );
          }}
        >
          Render
        </Button>
        <FileDownload source={blob} />
      </Flex>
    </Flex>
  );
};

const handleRender = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  overlayEl: string[],
  onProgress: (frameNum: number, timeMS: number) => void,
) => {
  const renderer = getCanvasVideoRenderer(canvas, video, overlayEl, true);

  if (renderer.status === 'processing') {
    renderer.stop();
    renderer.clear();
  } else {
    renderer.render(onProgress);
  }
};
