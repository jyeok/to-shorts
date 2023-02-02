import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import {
  forwardRef,
  ReactEventHandler,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface VideoCanvasProps {
  videoSrc: string;
  overlaySrc: string[];
}

export interface VideoCanvasRef {
  canvas: HTMLCanvasElement | null;
  video: HTMLVideoElement | null;
}

export const VideoCanvas = forwardRef<VideoCanvasRef, VideoCanvasProps>(
  ({ videoSrc, overlaySrc }, ref) => {
    const frameNumRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [overlayEl, setOverlayEl] = useState<HTMLImageElement[]>([]);

    useEffect(() => {
      Promise.all(
        overlaySrc.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = () => resolve(img);
            }),
        ),
      ).then((imgs) => setOverlayEl(imgs));
    }, [overlaySrc]);

    useImperativeHandle(
      ref,
      () => ({
        canvas: canvasRef.current,
        video: videoRef.current,
      }),
      [],
    );

    const renderFrame = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx || !video) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      overlayEl.forEach((each) =>
        ctx.drawImage(each, Math.random() * canvas.width, Math.random() * canvas.height),
      );

      frameNumRef.current = requestAnimationFrame(() => renderFrame());
    };

    const handleVideoStart = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      video.onplay = () => {
        frameNumRef.current = requestAnimationFrame(() => renderFrame());
      };
      video.play();
    };

    const handleVideoStop = () => {
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      video.onplay = null;
      if (frameNumRef.current !== null) cancelAnimationFrame(frameNumRef.current);
    };

    const onVideoLoaded: ReactEventHandler<HTMLVideoElement> = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video) return;

      canvas.height = video.videoHeight * window.devicePixelRatio;
      canvas.width = video.videoWidth * window.devicePixelRatio;
      canvas.style.width = `${video.videoWidth}px`;
      canvas.style.height = `${video.videoHeight}px`;

      video.currentTime = 0.01;
      setTimeout(() => {
        renderSingleFrame(canvas, video, overlayEl);
        video.currentTime = 0;
      }, 100);
    };

    return (
      <Flex direction='column' gap={4} align='center'>
        <Box pos='relative' style={{ backgroundColor: 'lightgray' }}>
          <video
            onLoadedData={onVideoLoaded}
            src={videoSrc}
            ref={videoRef}
            style={{ display: 'none' }}
          />
          <canvas ref={canvasRef} />
        </Box>
        <HStack spacing={4}>
          <Button onClick={handleVideoStart}>Start</Button>
          <Button onClick={handleVideoStop}>Stop</Button>
        </HStack>
      </Flex>
    );
  },
);

VideoCanvas.displayName = 'VideoCanvas';

export default VideoCanvas;

const renderSingleFrame = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  overlayEl: HTMLImageElement[],
) => {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(video, 0, 0, canvas.width / 2, canvas.height / 2);
  overlayEl.forEach((each) =>
    ctx.drawImage(each, (Math.random() * canvas.width) / 2, (Math.random() * canvas.height) / 2),
  );
};
