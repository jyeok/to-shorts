import { useEffect, useRef } from 'react';
import * as FFmpeg from '@ffmpeg/ffmpeg';
import './App.css';

function App() {
  const uploaderRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const { createFFmpeg, fetchFile } = FFmpeg;

  const ffmpeg = createFFmpeg({ log: true });

  const transcode = async ({ target: { files } }: any) => {
    if (!playerRef.current) return;

    const { name } = files[0];
    await ffmpeg.load();
    ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
    await ffmpeg.run('-i', name, 'output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    playerRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' }),
    );
  };

  useEffect(() => {
    uploaderRef.current?.addEventListener('change', transcode);

    return () => {
      uploaderRef.current?.removeEventListener('change', transcode);
    };
  }, []);

  return (
    <div className='App'>
      <video id='player' controls ref={playerRef} />
      <div>
        <input type='file' id='uploader' ref={uploaderRef} />
      </div>
    </div>
  );
}

export default App;
