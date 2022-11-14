import { useEffect } from 'react';
import { Converter } from './components/Converter';
import { getFFMpeg } from './utils/FFMpeg';

function App() {
  useEffect(() => {
    getFFMpeg();
  }, []);

  return (
    <div className='App'>
      <Converter />
    </div>
  );
}

export default App;
