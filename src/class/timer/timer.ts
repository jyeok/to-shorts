/* eslint-disable no-console */
export class Timer {
  private startTime = 0;
  private count = 0;
  private performance: Performance = window.performance;
  private verbose = false;
  private logger = console.log;

  constructor(verbose = false, logger = console.log) {
    this.verbose = verbose;
    this.logger = logger;
  }

  public clear = () => {
    this.startTime = 0;
    this.count = 0;
  };

  public stop = () => {
    const endTime = this.performance.now();
    const timeMS = endTime - this.startTime;

    this.logger(
      `ended after ${Timer.hhmmss(
        timeMS / 1000,
      )}, throughput: ${Timer.toHumanReadableSize(
        (this.count * 1000) / timeMS,
      )}/s`,
    );

    this.clear();
  };

  public measure = <R>(buffer: ArrayBuffer, fn: (buffer: ArrayBuffer) => R) => {
    if (this.startTime === 0) {
      this.startTime = this.performance.now();
    }

    const prevCnt = this.count;

    const result = fn(buffer);
    this.count += buffer.byteLength;

    if (
      this.verbose &&
      Math.floor(prevCnt / (1024 * 1024 * 10)) !==
        Math.floor(this.count / (1024 * 1024 * 10))
    )
      this.logger(`processed ${Timer.toHumanReadableSize(this.count)} bytes`);

    return result;
  };

  private static toHumanReadableSize(bytes: number, precision = 2): string {
    const THRESHOLD = 1000;

    if (Math.abs(bytes) < THRESHOLD) {
      return bytes + ' B';
    }

    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let u = -1;
    const r = 10 ** precision;

    do {
      bytes /= THRESHOLD;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= THRESHOLD &&
      u < units.length - 1
    );

    return bytes.toFixed(precision) + ' ' + units[u];
  }

  private static hhmmss = (timeInSeconds: number): string => {
    const pad = (num: number, size: number) => {
      return ('000' + num.toString()).slice(size * -1);
    };

    const time = timeInSeconds.toFixed(3);
    const hours = Math.floor(+time / 60 / 60);
    const minutes = Math.floor(+time / 60) % 60;
    const seconds = Math.floor(+time - minutes * 60);
    const milliseconds = time.slice(-3);

    return (
      (hours ? pad(hours, 2) + ':' : '') +
      (minutes ? pad(minutes, 2) + ':' : '') +
      pad(seconds, 2) +
      '.' +
      pad(+milliseconds, 3)
    );
  };
}
