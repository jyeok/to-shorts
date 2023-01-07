import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import {
  forwardRef,
  ReactEventHandler,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface VideoCanvasProps {
  videoSrc: string;
}

export interface VideoCanvasRef {
  canvas: HTMLCanvasElement | null;
  video: HTMLVideoElement | null;
}

export const VideoCanvas = forwardRef<VideoCanvasRef, VideoCanvasProps>(
  ({ videoSrc }, ref) => {
    const [started, setStarted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const renderFrame = useCallback(
      (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (started === true)
          requestAnimationFrame(() => renderFrame(canvas, video));
      },
      [started],
    );

    useEffect(() => {
      if (!started) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const num = requestAnimationFrame(() => renderFrame(canvas, video));

      return () => cancelAnimationFrame(num);
    }, [renderFrame, started]);

    useImperativeHandle(
      ref,
      () => ({
        canvas: canvasRef.current,
        video: videoRef.current,
      }),
      [],
    );

    const handleVideoStart = () => {
      const video = videoRef.current;
      if (!video) return;

      setStarted(true);
      video.play();
    };

    const handleVideoStop = () => {
      const video = videoRef.current;
      if (!video) return;

      setStarted(false);
      video.pause();
    };

    const onVideoLoaded: ReactEventHandler<HTMLVideoElement> = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video) return;
      const ratio = video.videoHeight
        ? video.videoWidth / video.videoHeight
        : 0;

      canvas.height = Math.min(400, video.videoHeight);
      canvas.width = ratio * canvas.height;

      video.currentTime = 0.01;
      setTimeout(() => {
        canvas
          .getContext('2d')
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
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
