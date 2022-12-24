import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface VideoCanvasProps {
  width: number;
  height: number;
}

export interface VideoCanvasRef {
  canvas: HTMLCanvasElement | null;
  video: HTMLVideoElement | null;
}

const absolute: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

export const VideoCanvas = forwardRef<VideoCanvasRef, VideoCanvasProps>(
  ({ height, width }, ref) => {
    const [started, setStarted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const renderFrame = useCallback(
      (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

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

    return (
      <Flex direction='column' gap={4} align='center'>
        <Box
          pos='relative'
          style={{ backgroundColor: 'lightgray', width, height }}
        >
          <video ref={videoRef} style={{ ...absolute, display: 'none' }} />
          <canvas style={{ ...absolute, width, height }} ref={canvasRef} />
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
