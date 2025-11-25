import React from 'react';

export const InfoOverlay: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 z-10 max-w-sm pointer-events-none">
      <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Double Slit Experiment</h1>
      <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 text-sm text-gray-300 shadow-xl">
        <p className="mb-2">
            Observe how the wave-like nature of particles creates an interference pattern on the screen.
        </p>
        <div className="font-mono text-xs bg-black/50 p-2 rounded border border-white/5 my-2">
          I(θ) ∝ cos²(πd sinθ / λ) · sinc²(πa sinθ / λ)
        </div>
        <ul className="list-disc pl-4 space-y-1 text-xs">
            <li><strong className="text-blue-300">λ (Wavelength):</strong> Changes light color and fringe spacing.</li>
            <li><strong className="text-blue-300">d (Separation):</strong> Wider slits = Closer fringes.</li>
            <li><strong className="text-blue-300">a (Width):</strong> Affects the diffraction envelope (brightness falloff).</li>
        </ul>
      </div>
    </div>
  );
};
