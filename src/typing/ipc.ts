export type IPC = 'PING' | 'RUN_FFMPEG';

export type TPingAPI = (msg: string) => void;
export type TPingHandler = ({ msg }: { msg: string }) => void;

type runFFMpegOptions = {
  fps: number;
  width: number;
  height: number;
};
export type TRunFFMpegAPI = (options: runFFMpegOptions) => void;
export type TRunFFMpegHandler = ({ options }: { options: runFFMpegOptions }) => void;

export type ElectronAPI = {
  PING: TPingAPI;
  RUN_FFMPEG: TRunFFMpegAPI;
};
