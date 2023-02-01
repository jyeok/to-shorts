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
  overlaySrc?: string;
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
    const [overlayEl, setOverlayEl] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
      if (overlaySrc) {
        const image = new Image();
        image.src = overlaySrc;
        image.onload = () => {
          setOverlayEl(image);
          if (canvasRef.current && videoRef.current)
            renderFrame(canvasRef.current, videoRef.current, image);
        };
      } else {
        setOverlayEl(null);
      }
    }, [overlaySrc]);

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
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      frameNumRef.current = requestAnimationFrame(() => renderFrame(canvas, video, overlayEl));
      video.play();
    };

    const handleVideoStop = () => {
      const video = videoRef.current;
      if (!video) return;
      if (frameNumRef.current !== null) cancelAnimationFrame(frameNumRef.current);

      video.pause();
    };

    const onVideoLoaded: ReactEventHandler<HTMLVideoElement> = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video) return;
      const ratio = video.videoHeight ? video.videoWidth / video.videoHeight : 0;

      canvas.height = Math.min(400, video.videoHeight);
      canvas.width = ratio * canvas.height;

      video.currentTime = 0.01;
      setTimeout(() => {
        renderFrame(canvas, video, overlayEl);
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

const renderFrame = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  overlay: HTMLImageElement | null,
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  if (overlay) {
    ctx.drawImage(overlay, 0, 0, canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(() => renderFrame(canvas, video, overlay));
};
