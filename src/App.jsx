import { useRef } from 'react';
import Calculator from './components/Calculator';
import { GlobalSpotlight } from './components/MagicBento';

function App() {
  const gridRef = useRef(null);

  return (
    <div
      ref={gridRef}
      className="bento-section min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center"
    >
      <GlobalSpotlight
        gridRef={gridRef}
        enabled
        spotlightRadius={400}
        glowColor="132, 0, 255"
      />
      <Calculator />
    </div>
  );
}

export default App;
