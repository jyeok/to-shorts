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

const pingHandler = handler<IPCTypes.TPingHandler>('PING', (arg) => console.log(arg.msg));
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

export const registerIPC = () => {
  const handlerRegisterers = {
    PING: pingHandler,
    RUN_FFMPEG: ffmpegHandler,
  } as const;

  Object.values(handlerRegisterers).forEach((each) => each());
};
