import { Button } from '@chakra-ui/react';
import { BrowserFileSystem } from '../class/fs';

export interface FileDownloadProps {
  source?: FileSystemWriteChunkType;
  option?: SaveFilePickerOptions;
}

export const FileDownload = (props: FileDownloadProps) => {
  const handleOpen = async () => {
    if (!props.source) return;
    return await BrowserFileSystem.save(props.source, props.option);
  };

  return (
    <Button disabled={props.source === undefined} onClick={handleOpen}>
      Download
    </Button>
  );
};

FileDownload.displayName = 'FileDownload';
export default FileDownload;
