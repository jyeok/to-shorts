import { Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getFFMpeg, scaleVideo, transcodeToMp4 } from '../utils/FFMpeg';
import FileDownload from './FileDownload';
import { FileInfo } from './FileInfo';
import FileInput from './FileInput';
import VideoCanvas from './VideoCanvas';

export const Converter = () => {
  const videoSrcRef = useRef<string>();
  const [selectedVideo, setSelectedVideo] = useState<File[] | null>(null);
  const [blob, setBlob] = useState<Blob>();
  const [status, setStatus] = useState('idle');

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
      videoSrcRef.current = URL.createObjectURL(files[0]);
    }
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
      {videoSrcRef.current && <VideoCanvas videoSrc={videoSrcRef.current} />}
      <Text>{status}</Text>
      <Flex align='center' justifyContent='center' gap={4}>
        <FileInput onSelect={onSelectVideo} />
        <Button disabled={selectedVideo === null} onClick={handleTranscode}>
          Transcode
        </Button>
        <Button disabled={selectedVideo === null} onClick={handleScale}>
          Scale
        </Button>
        <FileDownload source={blob} />
      </Flex>
    </Flex>
  );
};
