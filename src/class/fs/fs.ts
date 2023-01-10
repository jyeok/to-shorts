export class BrowserFileSystem {
  private fileHandles: FileSystemFileHandle[] | null = null;

  public static writeInplace = async (
    fileHandle: FileSystemFileHandle,
    content: FileSystemWriteChunkType,
    option: FileSystemCreateWritableOptions = {},
    close = true,
  ) => {
    const writable = await fileHandle.createWritable(option);
    await writable.write(content);
    if (close) await writable.close();

    return true;
  };

  public getHandles = () => this.fileHandles;
  public getFileByName = (name: string) =>
    this.fileHandles
      ? this.fileHandles.find((file) => file.name === name) ?? null
      : null;

  public open = async (options?: OpenFilePickerOptions) => {
    try {
      this.fileHandles = await window.showOpenFilePicker(options);

      return this.fileHandles;
    } catch (error) {
      console.error(error);
    }
  };

  public static save = async (
    source: FileSystemWriteChunkType,
    options?: SaveFilePickerOptions,
  ) => {
    try {
      const downloadHandle = await window.showSaveFilePicker(options);
      const writeStream = await downloadHandle.createWritable();

      await writeStream.write(source);
      await writeStream.close();

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  public close = () => {
    this.fileHandles = null;
  };
}

export class BrowserDirectorySystem {
  private directoryHandle: FileSystemDirectoryHandle | null = null;

  public static getSubDirectory = async (
    directoryHandle: FileSystemDirectoryHandle,
    name: string,
    create = false,
  ) => {
    const subDirectoryHandle = await directoryHandle.getDirectoryHandle(name, {
      create,
    });

    return subDirectoryHandle;
  };

  public getHandles = () => this.directoryHandle;

  public getEntries = async () => {
    if (!this.directoryHandle) return null;
    const entries = this.directoryHandle.entries();
    const entriesArray: [
      string,
      FileSystemFileHandle | FileSystemDirectoryHandle,
    ][] = [];

    for await (const entry of entries) {
      entriesArray.push(entry);
    }

    return entriesArray;
  };

  public getKeys = async () => {
    if (!this.directoryHandle) return null;
    const keys = this.directoryHandle.keys();
    const keysArray: string[] = [];

    for await (const key of keys) {
      keysArray.push(key);
    }

    return keysArray;
  };

  public getValues = async () => {
    if (!this.directoryHandle) return null;
    const values = this.directoryHandle.values();
    const valuesArray: (FileSystemFileHandle | FileSystemDirectoryHandle)[] =
      [];

    for await (const value of values) {
      valuesArray.push(value);
    }

    return valuesArray;
  };

  public open = async () => {
    try {
      this.directoryHandle = await window.showDirectoryPicker();
    } catch (error) {
      console.error(error);
    }
  };

  public getFile = async (name: string, create = false) => {
    if (!this.directoryHandle) return null;
    const fileHandle = await this.directoryHandle.getFileHandle(name, {
      create,
    });

    return fileHandle;
  };

  public writeFile = async (
    name: string,
    content: FileSystemWriteChunkType,
    option: FileSystemCreateWritableOptions = {},
    close = true,
  ) => {
    if (!this.directoryHandle) return false;

    const fileHandle = await this.getFile(name, true);

    if (!fileHandle) return false;
    await BrowserFileSystem.writeInplace(fileHandle, content, option, close);

    return true;
  };

  public close = () => {
    this.directoryHandle = null;
  };
}
