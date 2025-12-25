import React from 'react';
import { InteractiveState } from '../types';

// Icons
const LightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const RotationIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const ExplodeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
)

const GatherIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)

const UI: React.FC<InteractiveState> = ({ 
  lightsOn, setLightsOn, 
  rotationSpeed, setRotationSpeed,
  isScattered, setIsScattered
}) => {
  return (
    <div className="flex flex-col justify-between h-full p-8 md:p-12 pointer-events-none">
      
      {/* Header */}
      <header className="flex flex-col items-center md:items-start space-y-2 animate-fade-in-down pointer-events-auto">
        <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)] whitespace-nowrap">
          丁曈へ贈るクリスマスツリー
        </h1>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </header>

      {/* Controls Container */}
      <footer className="flex flex-col items-center space-y-6 pointer-events-auto">
        
        {/* Glassmorphism Control Panel */}
        <div className="backdrop-blur-md bg-black/60 border border-[#D4AF37]/30 rounded-full px-8 py-4 flex items-center gap-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-105 duration-300">
          
          {/* Light Toggle */}
          <button 
            onClick={() => setLightsOn(!lightsOn)}
            className={`group flex flex-col items-center gap-1 transition-all duration-300 ${lightsOn ? 'text-[#D4AF37]' : 'text-gray-500'}`}
          >
            <div className={`p-3 rounded-full border border-current transition-all duration-500 ${lightsOn ? 'shadow-[0_0_15px_#D4AF37]' : ''}`}>
              <LightIcon />
            </div>
            <span className="text-[9px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6">
              Lights
            </span>
          </button>

          <div className="w-px h-8 bg-[#D4AF37]/20"></div>

          {/* Morph / Scatter Toggle */}
          <button 
            onClick={() => setIsScattered(!isScattered)}
            className={`group flex flex-col items-center gap-1 transition-all duration-300 ${isScattered ? 'text-[#D4AF37]' : 'text-emerald-400'}`}
          >
             <div className="p-3 rounded-full border border-current transition-all duration-500 hover:bg-[#D4AF37]/10">
               {isScattered ? <GatherIcon /> : <ExplodeIcon />}
             </div>
             <span className="text-[9px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 w-max text-center left-1/2 -translate-x-1/2">
              {isScattered ? 'Assemble' : 'Scatter'}
            </span>
          </button>

          <div className="w-px h-8 bg-[#D4AF37]/20"></div>

          {/* Rotation Control */}
          <button 
            onClick={() => setRotationSpeed(rotationSpeed > 0 ? 0 : 0.2)}
            className={`group flex flex-col items-center gap-1 transition-all duration-300 ${rotationSpeed > 0 ? 'text-[#D4AF37]' : 'text-gray-500'}`}
          >
             <div className="p-3 rounded-full border border-current">
               <RotationIcon />
             </div>
             <span className="text-[9px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6">
              {rotationSpeed > 0 ? 'Stop' : 'Spin'}
            </span>
          </button>

        </div>

        <p className="text-[#D4AF37]/40 text-xs font-serif italic tracking-wider">
          For Ding Tong · Merry Christmas
        </p>
      </footer>
    </div>
  );
};

export default UI;