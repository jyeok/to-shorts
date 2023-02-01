type TEncoderStatus = 'ready' | 'processing' | 'error' | 'done';

class FFMpegEncoder {
  private _status: TEncoderStatus = 'ready';
  private buffers: Uint8ClampedArray[] = [];

  public get status(): TEncoderStatus {
    return this._status;
  }

  protected set status(status: TEncoderStatus) {
    this._status = status;
  }

  public push = (buffer: Uint8ClampedArray) => {
    this.buffers.push(buffer);
  };

  public flush = () => {
    this.buffers = [];
  };
}

let ffmpegEncoder: FFMpegEncoder | null = null;
export const getFFMpegEncoder = () => {
  if (!ffmpegEncoder) {
    ffmpegEncoder = new FFMpegEncoder();
  }
  return ffmpegEncoder;
};
