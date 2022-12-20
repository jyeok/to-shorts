import { useEffect } from 'react';
import { FileInput } from './components/FileInput';
import { getFFMpeg } from './utils/FFMpeg';

function App() {
  useEffect(() => {
    getFFMpeg();
  }, []);

  return (
    <div className='App'>
      <FileInput />
    </div>
  );
}

export default App;
