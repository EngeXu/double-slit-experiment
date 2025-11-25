import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { SimulationParams, ViewMode } from '../types';
import { SlitBarrier } from './SlitBarrier';
import { InterferenceScreen } from './InterferenceScreen';
import { ParticleSystem } from './ParticleSystem';
import { Vector3 } from 'three';

// Helper to convert wavelength (nm) to approximate RGB color
const wavelengthToColor = (wavelength: number) => {
  let R, G, B;
  const L = wavelength;
  if (L >= 380 && L < 440) { R = -(L - 440) / (440 - 380); G = 0; B = 1; }
  else if (L >= 440 && L < 490) { R = 0; G = (L - 440) / (490 - 440); B = 1; }
  else if (L >= 490 && L < 510) { R = 0; G = 1; B = -(L - 510) / (510 - 490); }
  else if (L >= 510 && L < 580) { R = (L - 510) / (580 - 510); G = 1; B = 0; }
  else if (L >= 580 && L < 645) { R = 1; G = -(L - 645) / (645 - 580); B = 0; }
  else if (L >= 645 && L <= 780) { R = 1; G = 0; B = 0; }
  else { R = 0; G = 0; B = 0; }
  return `rgb(${Math.round(R * 255)},${Math.round(G * 255)},${Math.round(B * 255)})`;
};

interface SceneProps {
  params: SimulationParams;
  viewMode: ViewMode;
}

const CameraController = ({ viewMode }: { viewMode: ViewMode }) => {
    const controlsRef = useRef<any>(null);
    useFrame((state) => {
        if (!controlsRef.current) return;
        
        const targetPos = viewMode === ViewMode.TopDown 
            ? new Vector3(0, 20, 5) 
            : new Vector3(15, 8, 15); // Perspective
        
        // Smoothly interpolate camera position (simple lerp)
        state.camera.position.lerp(targetPos, 0.05);
        controlsRef.current.update();
    });

    return <OrbitControls ref={controlsRef} target={[0, 0, 5]} />;
};

export const Scene: React.FC<SceneProps> = ({ params, viewMode }) => {
  const laserColor = wavelengthToColor(params.wavelength);

  return (
    <Canvas shadows camera={{ fov: 45, position: [15, 8, 15] }}>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 60]} />
      
      <CameraController viewMode={viewMode} />

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, -5]} intensity={1} castShadow />
      
      {/* The Source (Electron Gun / Laser) */}
      <group position={[0, 0, -12]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 1, 4, 16]} />
            <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing tip */}
        <mesh position={[0, 0, 2.1]}>
            <sphereGeometry args={[0.3]} />
            <meshBasicMaterial color={laserColor} />
        </mesh>
        <pointLight position={[0, 0, 2.5]} color={laserColor} intensity={2} distance={10} />
      </group>

      {/* The Components */}
      <SlitBarrier params={params} />
      <InterferenceScreen params={params} color={laserColor} />
      <ParticleSystem params={params} color={laserColor} />

      {/* Floor visualization for depth */}
      <gridHelper position={[0, -5, 5]} args={[50, 50, 0x222222, 0x111111]} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floor Reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#000" />
      </mesh>
    </Canvas>
  );
};