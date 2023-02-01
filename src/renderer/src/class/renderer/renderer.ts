/* eslint-disable no-console */
import { getIPC } from '@renderer/extern/ipc';
import { noop } from '../../utils/misc';
import { MediaVideoInfo, VideoProbe } from '../probe/probe';
import { Timer } from '../timer/timer';

type TRendererStatus = 'not_initialized' | 'ready' | 'processing' | 'error' | 'done';

type TLogger = (msg: unknown) => void;

export abstract class IRenderer {
  private _status: TRendererStatus = 'ready';
  private _timer;
  private _logger;
  private _verbose;

  constructor(verbose = true, logger: TLogger = console.log) {
    this._verbose = verbose;
    this._logger = logger;
    this._timer = new Timer(verbose, logger);
  }

  protected get logger(): TLogger {
    return this._logger;
  }

  protected set logger(logger: TLogger) {
    this._logger = logger;
  }

  protected get verbose(): boolean {
    return this._verbose;
  }

  protected set verbose(verbose: boolean) {
    this._verbose = verbose;
  }

  public get status(): TRendererStatus {
    return this._status;
  }

  protected set status(status: TRendererStatus) {
    this._status = status;
  }

  protected get timer(): Timer {
    return this._timer;
  }

  protected log = (message: unknown): void => {
    this._logger(message);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract init(...args: any): void;
  public abstract render(): void;
  public abstract stop(): void;
  public abstract clear(): void;
}

export class CanvasVideoRenderer extends IRenderer {
  private canvas: HTMLCanvasElement | undefined;
  private video: HTMLVideoElement | undefined;
  private videoInfo: MediaVideoInfo | undefined;
  private buffers: Uint8ClampedArray[] = [];
  private cnt = 0;

  constructor(
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    verbose = false,
    logger: TLogger = console.log,
  ) {
    super(verbose, logger);
    this.canvas = canvas;
    this.video = video;
    this.videoInfo = new VideoProbe(video).mediaInfo;
    getIPC().RUN_FFMPEG({
      fps: 30,
      width: this.canvas.width,
      height: this.canvas.height,
    });
  }

  public init = (
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    verbose = false,
    logger: TLogger = console.log,
  ): void => {
    this.canvas = canvas;
    this.video = video;
    this.videoInfo = new VideoProbe(video).mediaInfo;
    this.verbose = verbose;
    this.logger = logger;
    this.cnt = 0;
  };

  public render = (): void => {
    if (!this.canvas || !this.video || !this.videoInfo) {
      this.status = 'error';
      this.log('Canvas or video is not available');
      return;
    }

    const ctx = this.canvas.getContext('2d', {
      willReadFrequently: true,
    });
    if (!ctx) {
      this.status = 'error';
      this.log('Canvas context is not available');
      return;
    }

    this.status = 'processing';

    this.video.onseeked = () => {
      if (!this.canvas || !this.video || !this.videoInfo) {
        throw new Error(
          `no canvas or video in onSeeked, ${this.canvas}, ${this.video}, ${this.videoInfo}`,
        );
      }

      ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      const frame = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

      this.pushData(frame.data);
      this.sendData(false);
      this.timer.measure(frame.data, noop);
      this.seekVideo();
    };

    this.video.onerror = (event) => {
      this.status = 'error';
      this.log(event);
    };

    this.video.currentTime = 0;
  };

  public stop = (): void => {
    if (!this.video) return;
    this.sendData(true);
    getIPC().END_FFMPEG();
    console.log(`total frames: ${this.cnt}`);

    this.timer.stop();
    this.timer.clear();
    this.video.onseeked = noop;
    this.video.currentTime = 0;
    this.status = 'done';
    this.cnt = 0;
  };

  public clear = (): void => {
    if (this.status === 'processing') {
      this.stop();
    }

    this.canvas = undefined;
    this.video = undefined;
    this.videoInfo = undefined;
    this.status = 'not_initialized';
  };

  private seekVideo = (): boolean => {
    if (!this.video || !this.videoInfo) return false;

    const duration = this.video.duration;
    const frameRate = this.videoInfo.video.frameRate;
    const currTime = this.video.currentTime;
    const tick = 1 / frameRate;

    if (currTime >= duration) {
      this.stop();
      return false;
    }

    this.video.currentTime += tick;
    return true;
  };

  private pushData = (data: Uint8ClampedArray): void => {
    this.buffers.push(data);
  };

  private sendData = (force: boolean) => {
    if (this.buffers.length === 0) return;
    if (this.buffers.length < 10 && !force) return;

    const concatenated = new Uint8ClampedArray(
      this.buffers[0].length * Math.min(10, this.buffers.length),
    );

    for (let cnt = 0; cnt < 10; cnt++) {
      const target = this.buffers.shift();
      if (!target) break;
      concatenated.set(target, cnt * target.length);
    }

    this.cnt++;
    getIPC().PUSH_FFMPEG(concatenated.buffer);
  };
}

let canvasVideoRenderer: CanvasVideoRenderer | null = null;
export const getCanvasVideoRenderer = (
  ...args: ConstructorParameters<typeof CanvasVideoRenderer>
) => {
  if (canvasVideoRenderer === null) {
    canvasVideoRenderer = new CanvasVideoRenderer(...args);
  }

  return canvasVideoRenderer;
};
