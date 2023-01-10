type TEncoderStatus = 'ready' | 'processing' | 'error' | 'done';

export abstract class IEncoder {
  private _status: TEncoderStatus = 'ready';

  public get status(): TEncoderStatus {
    return this._status;
  }

  public abstract encode(): void;
}
