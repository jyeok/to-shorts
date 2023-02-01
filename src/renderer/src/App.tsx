import { Flex } from '@chakra-ui/react';
import { Converter } from './components/Converter';

function App() {
  return (
    <Flex pt={20} justifyContent='center' direction='column' align='center'>
      <Converter />
    </Flex>
  );
}

export default App;
