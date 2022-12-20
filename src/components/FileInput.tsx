import { Box, Button, Center } from '@chakra-ui/react';
import { useState } from 'react';

export const FileInput = () => {
  const {
    file,
    folderHandle,
    handleGetFileHandle,
    handleGetFolderHandle,
    getFileHandleInFolderHandle,
  } = useFile();

  const indicator = file && (
    <Box>{`
   이름: ${file.name} 크기: ${file.size} 타입: ${file.type} 
  `}</Box>
  );
  return (
    <Center pt={40} flexDirection='column' gap={12}>
      <Button onClick={handleGetFileHandle}>파일 불러오기</Button>
      <Button onClick={handleGetFolderHandle}>폴더 불러오기</Button>
      {folderHandle && (
        <Button
          onClick={async () => {
            writeFile(
              await getFileHandleInFolderHandle(folderHandle, 'hello.txt'),
              'hello',
            );
          }}
        >
          {folderHandle.name}
        </Button>
      )}
      {indicator}
    </Center>
  );
};
const writeFile = async (
  fileHandle: FileSystemFileHandle,
  contents: string,
) => {
  const file = new File([contents], fileHandle.name, {
    type: 'text/plain',
  });
  const writableStream = await fileHandle.createWritable();

  await writableStream.write(file);
  await writableStream.close();
};

const useFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [folderHandle, setFolderHandle] =
    useState<FileSystemDirectoryHandle | null>(null);

  const handleGetFileHandle = async () => {
    const [fileHandle] = await window.showOpenFilePicker();
    setFile(await fileHandle.getFile());
  };

  const handleGetFolderHandle = async () => {
    const folderHandle = await window.showDirectoryPicker();
    setFolderHandle(folderHandle);
  };

  const getFileHandleInFolderHandle = async (
    folderHandle: FileSystemDirectoryHandle,
    name: string,
  ) => {
    const fileHandle = await folderHandle.getFileHandle(name, {
      create: true,
    });
    return fileHandle;
  };

  return {
    file,
    folderHandle,
    handleGetFileHandle,
    handleGetFolderHandle,
    getFileHandleInFolderHandle,
  };
};
