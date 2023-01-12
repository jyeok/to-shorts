import { contextBridge, ipcRenderer } from 'electron';
import * as IPCTypes from '../typing/ipc';

const handler = <P>(ipc: IPCTypes.IPC, arg: P) => ipcRenderer.send(ipc, arg);

const pingHandler: IPCTypes.TPingAPI = (msg) => handler('PING', { msg });
const ffmpegHandler: IPCTypes.TRunFFMpegAPI = (options) =>
  handler('RUN_FFMPEG', {
    options,
  });

export type IPCHandler = typeof pingHandler | typeof ffmpegHandler;

const api: Record<IPCTypes.IPC, IPCHandler> = {
  PING: pingHandler,
  RUN_FFMPEG: ffmpegHandler,
};

contextBridge.exposeInMainWorld('electron', api);
