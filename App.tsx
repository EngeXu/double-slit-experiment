import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { InfoOverlay } from './components/InfoOverlay';
import { SimulationParams, ViewMode } from './types';

const App: React.FC = () => {
  // Initial State
  const [params, setParams] = useState<SimulationParams>({
    wavelength: 500, // Green-ish cyan
    slitSeparation: 1.5,
    slitWidth: 0.3,
    screenDistance: 15,
    particleCount: 2000,
    isPlaying: true,
  });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Perspective);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Scene params={params} viewMode={viewMode} />
      </div>

      {/* UI Layer */}
      <InfoOverlay />
      <Controls 
        params={params} 
        setParams={setParams} 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
};

export default App;
