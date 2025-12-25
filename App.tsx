import React, { useState } from 'react';
import Scene from './components/Scene';
import UI from './components/UI';

const App: React.FC = () => {
  const [lightsOn, setLightsOn] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.2); // Slower default for majesty
  const [isScattered, setIsScattered] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#000c05]">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene 
          lightsOn={lightsOn} 
          rotationSpeed={rotationSpeed} 
          isScattered={isScattered}
        />
      </div>
      
      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <UI 
          lightsOn={lightsOn} 
          setLightsOn={setLightsOn} 
          rotationSpeed={rotationSpeed}
          setRotationSpeed={setRotationSpeed}
          isScattered={isScattered}
          setIsScattered={setIsScattered}
        />
      </div>
    </div>
  );
};

export default App;