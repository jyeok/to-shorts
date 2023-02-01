/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain } from 'electron';
import * as IPCTypes from '../../typing/ipc';
import { getLocalFFMpeg } from '../ffmpeg/ffmpeg';

const handler =
  <F extends (...args: any) => void>(ipc: IPCTypes.IPC, callback: F) =>
  () =>
    ipcMain.on(ipc, (_, args) => {
      callback(args as Parameters<F>);
    });

const ffmpegHandler = handler<IPCTypes.TRunFFMpegHandler>('RUN_FFMPEG', (args) => {
  const { options } = args;
  const ffmpeg = getLocalFFMpeg();
  ffmpeg.build(options, {
    onEnd: console.log,
    onError: console.log,
    onFail: console.log,
    onProgress: console.log,
  });
});

const ffmpegPushHandler = handler<IPCTypes.TPushFFMpegHandler>('PUSH_FFMPEG', (args) => {
  const { buffer } = args;
  const ffmpeg = getLocalFFMpeg();
  ffmpeg.push(Buffer.from(buffer));
});

const ffmpegEndHandler = handler<IPCTypes.TEndFFMpegHandler>('END_FFMPEG', () => {
  const ffmpeg = getLocalFFMpeg();
  ffmpeg.end();
});

export const registerIPC = () => {
  const handlerRegisterers: Record<IPCTypes.IPC, () => void> = {
    RUN_FFMPEG: ffmpegHandler,
    PUSH_FFMPEG: ffmpegPushHandler,
    END_FFMPEG: ffmpegEndHandler,
  } as const;

  Object.values(handlerRegisterers).forEach((each) => each());
};
