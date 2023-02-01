import { contextBridge, ipcRenderer } from 'electron';
import * as IPCTypes from '../typing/ipc';

const api = <P>(ipc: IPCTypes.IPC, arg: P) => ipcRenderer.send(ipc, arg);

const runFFMpegAPI: IPCTypes.TRunFFMpegAPI = (options) =>
  api('RUN_FFMPEG', {
    options,
  });
const pushFFMpegAPI: IPCTypes.TPushFFMpegAPI = (buffer) => api('PUSH_FFMPEG', { buffer });
const endFFMpegAPI: IPCTypes.TEndFFMpegAPI = () => api('END_FFMPEG', {});

export type IPCHandler = typeof runFFMpegAPI | typeof pushFFMpegAPI;

const apis: Record<IPCTypes.IPC, IPCHandler> = {
  RUN_FFMPEG: runFFMpegAPI,
  PUSH_FFMPEG: pushFFMpegAPI,
  END_FFMPEG: endFFMpegAPI,
};

contextBridge.exposeInMainWorld('electron', apis);
