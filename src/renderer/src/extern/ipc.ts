import { ElectronAPI } from 'src/typing/ipc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getIPC = () => (window as any).electron as ElectronAPI;
