export class BrowserEncoder {
  private stream: MediaStream;
  private recorder: MediaRecorder;
  private chunks: Blob[] = [];

  constructor(stream: MediaStream) {
    this.stream = stream;
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = this.appendChunks;
  }

  private appendChunks = (e: BlobEvent) => {
    this.chunks.push(e.data);
  };

  public stop = () => {
    console.log('stop');

    this.recorder.stop();
  };

  private export = () => {
    const blob = new Blob(this.chunks);

    return blob;
  };

  public start = () => {
    console.log('start');

    this.recorder.ondataavailable = this.appendChunks;
    this.recorder.onstop = this.export;
    this.recorder.start();
  };
}
