import { Badge, Flex } from '@chakra-ui/react';
import { getHumanReadableFileSize } from '../utils/misc';

interface FileInfoProps {
  file: File;
}

export const FileInfo = ({ file }: FileInfoProps) => {
  const { name, size, type } = file;
  return (
    <Flex userSelect='none' gap={4}>
      <Badge>name: {name}</Badge>
      <Badge>size: {getHumanReadableFileSize(size)}</Badge>
      <Badge>type: {type}</Badge>
    </Flex>
  );
};
