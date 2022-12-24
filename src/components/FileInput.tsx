import { Button } from '@chakra-ui/react';
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { BrowserFileSystem } from '../class/fs';

export interface FileInputProps {
  onSelect: (files: File[] | null) => void;
  option?: OpenFilePickerOptions;
}

export interface FileInputRef {
  fs: BrowserFileSystem;
}

export const FileInput = forwardRef<FileInputRef, FileInputProps>(
  (props, ref) => {
    const fs = useFile(ref);

    const handleOpen = async () => {
      const fileHandles = await fs.open(props.option);

      if (fileHandles) {
        const files = await Promise.all(
          fileHandles.map((fileHandle) => fileHandle.getFile()),
        );
        props.onSelect(files);
      }
    };

    return <Button onClick={handleOpen}>Select File</Button>;
  },
);

const useFile = (ref: ForwardedRef<FileInputRef>) => {
  const fsRef = useRef(new BrowserFileSystem());

  useImperativeHandle(ref, () => ({
    fs: fsRef.current,
  }));

  return fsRef.current;
};

FileInput.displayName = 'FileInput';
export default FileInput;
