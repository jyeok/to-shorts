const { join } = require('path');
const { app, BrowserWindow } = require('electron');
const dotenv = require('dotenv');
dotenv.config();

const isDev = process.env.IS_DEV == 'true' ? true : false;
const VITE_PORT = process.env.VITE_PORT;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? `http://localhost:${VITE_PORT}`
      : `file://${join(__dirname, '../dist/index.html')}`,
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
