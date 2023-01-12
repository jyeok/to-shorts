declare global {
  interface Window {
    electron: {
      ping: (msg: string) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      runFFMpeg: (options: any, handlers: any) => void;
    };
    api: unknown;
  }
}
