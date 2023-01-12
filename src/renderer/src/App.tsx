import { Flex } from '@chakra-ui/react';
import { Converter } from './components/Converter';
import { getIPC } from './extern/ipc';

function App() {
  return (
    <Flex pt={20} justifyContent='center' direction='column' align='center'>
      <Converter />
      <button
        onClick={() => {
          console.log(
            getIPC().RUN_FFMPEG({
              fps: 30,
              height: 1080,
              width: 1920,
            }),
          );
        }}
      >
        하이
      </button>
    </Flex>
  );
}

export default App;
