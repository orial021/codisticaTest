import React from 'react';
import Spiral from './components/Spiral';

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Spiral
        totalCircles={50}
        spiralDensity={0.5}
        animationDuration={500}
        clockwise={true}
      />
    </div>
  );
};

export default App;
