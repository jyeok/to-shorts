import { IpcMainEvent } from 'electron';

const Electron = require('electron');
const ipcMain = Electron.ipcMain;

export const enum IPC {
  PING = 'ping',
}

type IPCHandler<P> = (event: IpcMainEvent, arg: P) => void;

const handler = <I extends IPC, P, H extends IPCHandler<P>>(ipc: I, handler: H) =>
  ipcMain.on(ipc, (event: IpcMainEvent, ...args) => handler(event, args[0] as P));

export type PingHandler = IPCHandler<{ msg: string }>;

export const registerIPC = () => {
  registerPing();
};

const registerPing = () => {
  handler<IPC.PING, { msg: string }, PingHandler>(IPC.PING, (_, arg) => {
    console.log(arg);
  });
};
