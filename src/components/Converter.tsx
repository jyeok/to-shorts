import { ChangeEvent, useRef } from 'react';
import { scaleVideo } from '../utils/FFMpeg';
import { Input } from '@chakra-ui/react';

export const Converter = () => {
  const uploaderRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !playerRef.current) return;
    const res = await scaleVideo(file);
    playerRef.current.src = URL.createObjectURL(res);
  };

  return (
    <div>
      <video width={1280} id='player' controls ref={playerRef} />
      <div>
        <Input
          placeholder='Select Date and Time'
          size='md'
          type='file'
          onChange={onUpload}
          // onChange={transcode}
          ref={uploaderRef}
        />
        {/* <input
          type='file'
          id='uploader'
          ref={uploaderRef}
          onChange={transcode}
        /> */}
      </div>
    </div>
  );
};
