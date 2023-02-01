import { ChildProcess, spawn } from 'child_process';
import builder from 'fluent-ffmpeg';
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
  private ffmpeg: ChildProcess | null = null;
  private handlers: ILocalFFMpegBuildHandlers | null = null;
  private builder = builder();
  private command = '';
  private outputPath = homedir();
  private cnt = 0;

  public build = (options: ILocalFFMpegBuildOptions, handlers: ILocalFFMpegBuildHandlers) => {
    this.builder = builder()
      .input('-')
      .inputOption(['-pix_fmt rgba', `-video_size ${options.width}x${options.height}`])
      .inputFormat('rawvideo')
      .fps(options.fps)
      .videoCodec('h264_videotoolbox')
      .output(`${this.outputPath}/output.mp4`);

    this.handlers = handlers;
    this.command = this.builder._getArguments().join(' ');
    console.log(this.command);

    this.run();
  };

  private run = () => {
    const ffmpeg = spawn('ffmpeg ' + this.command, {
      env: process.env,
      shell: true,
    });
    ffmpeg.stdout
      .on('data', (data) => console.log(data.toString()))
      .on('error', (err) => console.log(err));

    ffmpeg.stderr.on('data', (data) => console.log(data.toString()));

    this.ffmpeg = ffmpeg;

    if (this.handlers) {
      ffmpeg.on('close', this.handlers.onEnd);
      ffmpeg.on('error', this.handlers.onError);
    }
  };

  public end = async () => {
    if (!this.ffmpeg) {
      console.log('No ffmpeg process to end');
      return;
    }

    // sleep 5 seconds.
    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.ffmpeg.stdin?.end();
    console.log(`pushed ${this.cnt}`);
  };

  public kill = () => {
    if (!this.ffmpeg) {
      console.log('No ffmpeg process to kill');
      return false;
    }

    this.ffmpeg.kill('SIGINT');
    return true;
  };

  public push = (buffer: Buffer) => {
    if (!this.ffmpeg) {
      console.log('no ffmpeg process to push to');
      return;
    }

    if (!this.ffmpeg.stdin) {
      console.log('no stdin to push to');
      return;
    }

    this.cnt++;
    this.ffmpeg.stdin.write(buffer);
  };
}

let localFFMpeg: LocalFFMpeg | null = null;
export const getLocalFFMpeg = () => {
  if (!localFFMpeg) {
    localFFMpeg = new LocalFFMpeg();
  }
  return localFFMpeg;
};
