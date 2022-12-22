import { Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getFFMpeg, scaleVideo, transcodeToMp4 } from '../utils/FFMpeg';
import { FileInfo } from './FileInfo';
import FileInput, { FileInputRef } from './FileInput';

export const Converter = () => {
  const fileRef = useRef<FileInputRef>(null);
  const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
  const [status, setStatus] = useState('idle');
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getFFMpeg({
      progress: ({ ratio: progress }) => {
        setStatus(`Transcoding ffmpeg... ${(100 * progress).toFixed(2)}%`);
      },
      log: true,
    });
  }, []);

  const handleTranscode = async () => {
    if (selectedFile) {
      const player = playerRef.current;
      if (player) {
        const url = URL.createObjectURL(selectedFile[0]);
        player.src = url;
        setStatus('Transcoding...');
        await transcodeToMp4(selectedFile[0]);
      }
    }
  };

  const handleScale = async () => {
    if (selectedFile) {
      const player = playerRef.current;
      if (player) {
        const url = URL.createObjectURL(selectedFile[0]);
        player.src = url;
        setStatus('Scaling...');
        await scaleVideo(selectedFile[0]);
      }
    }
  };

  const fileInfo = selectedFile ? <FileInfo file={selectedFile[0]} /> : null;

  return (
    <Flex align='center' justifyContent='center' direction='column' gap={6}>
      {fileInfo}
      <video width={840} height={680} id='player' controls ref={playerRef} />
      <Text>{status}</Text>
      <Flex align='center' justifyContent='center' gap={4}>
        <FileInput ref={fileRef} onSelect={setSelectedFile} />
        <Button disabled={selectedFile === null} onClick={handleTranscode}>
          Transcode
        </Button>
        <Button disabled={selectedFile === null} onClick={handleScale}>
          Scale
        </Button>
      </Flex>
    </Flex>
  );
};
