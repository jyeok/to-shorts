import ffmpeg from 'fluent-ffmpeg';
import { homedir } from 'os';

export interface ILocalFFMpegBuildOptions {
  fps: number;
  width: number;
  height: number;
}
export interface ILocalFFMpegBuildHandlers {
  onProgress: (progress: number) => void;
  onError: (errStr: string) => void;
  onFail: (failStr: string) => void;
  onEnd: () => void;
}

class LocalFFMpeg {
  private ffmpeg = ffmpeg();
  private outputPath = homedir();

  public build = (options: ILocalFFMpegBuildOptions, handlers: ILocalFFMpegBuildHandlers) => {
    this.ffmpeg = ffmpeg()
      .input('-')
      .inputOption(['-pix_fmt argb'])
      .inputFormat('rawvideo')
      .fps(options.fps)
      .size(`${options.width}x${options.height}`)
      .videoCodec('libx264')
      .output(`${this.outputPath}/output.mp4`)
      .on('progress', handlers.onProgress)
      .on('stderr', handlers.onError)
      .on('error', handlers.onFail)
      .on('end', handlers.onEnd);

    console.log(this.ffmpeg._getArguments().join(' '));
  };

  public run = () => {
    this.ffmpeg.run();
  };

  public kill = () => {
    this.ffmpeg.kill('SIGKILL');
  };
}

let localFFMpeg: LocalFFMpeg | null = null;
export const getLocalFFMpeg = () => {
  if (!localFFMpeg) {
    localFFMpeg = new LocalFFMpeg();
  }
  return localFFMpeg;
};
