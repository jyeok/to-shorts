export type IPC = 'RUN_FFMPEG' | 'PUSH_FFMPEG' | 'END_FFMPEG';

type runFFMpegOptions = {
  fps: number;
  width: number;
  height: number;
};
export type TRunFFMpegAPI = (options: runFFMpegOptions) => void;
export type TRunFFMpegHandler = ({ options }: { options: runFFMpegOptions }) => void;

export type TPushFFMpegAPI = (buffer: ArrayBufferLike) => void;
export type TPushFFMpegHandler = ({ buffer }: { buffer: ArrayBufferLike }) => void;

export type TEndFFMpegAPI = () => void;
export type TEndFFMpegHandler = () => void;

export type ElectronAPI = {
  RUN_FFMPEG: TRunFFMpegAPI;
  PUSH_FFMPEG: TPushFFMpegAPI;
  END_FFMPEG: TEndFFMpegAPI;
};
