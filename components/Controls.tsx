import React from 'react';
import { SimulationParams, ViewMode } from '../types';
import { Play, Pause, Rotate3D, Square } from 'lucide-react';

interface Props {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const Controls: React.FC<Props> = ({ params, setParams, viewMode, setViewMode }) => {
  
  const handleChange = (key: keyof SimulationParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const togglePlay = () => {
    setParams(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  return (
    <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent text-white flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 z-10 pointer-events-none">
      
      {/* Interactive Container */}
      <div className="pointer-events-auto w-full sm:w-2/3 lg:w-1/2 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Simulation Controls
            </h2>
             <button 
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-semibold transition-colors"
             >
                {params.isPlaying ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Simulate</>}
             </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            
            {/* Wavelength Control */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Wavelength (λ)</span>
                    <span className="text-blue-300 font-mono">{params.wavelength} nm</span>
                </div>
                <input 
                    type="range" min="380" max="750" step="10"
                    value={params.wavelength}
                    onChange={(e) => handleChange('wavelength', Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                        background: `linear-gradient(to right, #4a044e, #0000ff, #00ff00, #ffff00, #ff0000)`
                    }}
                />
            </div>

            {/* Slit Separation */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Slit Separation (d)</span>
                    <span className="text-blue-300 font-mono">{params.slitSeparation.toFixed(2)}</span>
                </div>
                <input 
                    type="range" min="0.5" max="3.0" step="0.1"
                    value={params.slitSeparation}
                    onChange={(e) => handleChange('slitSeparation', Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

             {/* Slit Width */}
             <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Slit Width (a)</span>
                    <span className="text-blue-300 font-mono">{params.slitWidth.toFixed(2)}</span>
                </div>
                <input 
                    type="range" min="0.1" max="1.0" step="0.05"
                    value={params.slitWidth}
                    onChange={(e) => handleChange('slitWidth', Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            {/* Screen Distance */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Screen Distance (L)</span>
                    <span className="text-blue-300 font-mono">{params.screenDistance.toFixed(1)}</span>
                </div>
                <input 
                    type="range" min="10" max="30" step="1"
                    value={params.screenDistance}
                    onChange={(e) => handleChange('screenDistance', Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="pointer-events-auto flex flex-col gap-2">
          <button 
            onClick={() => setViewMode(ViewMode.Perspective)}
            className={`p-3 rounded-lg border transition-all ${viewMode === ViewMode.Perspective ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
            title="Perspective View"
          >
            <Rotate3D size={24} />
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.TopDown)}
            className={`p-3 rounded-lg border transition-all ${viewMode === ViewMode.TopDown ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
             title="Top Down View"
          >
            <Square size={24} />
          </button>
      </div>
    </div>
  );
};
