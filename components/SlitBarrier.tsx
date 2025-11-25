import React from 'react';
import { SimulationParams } from '../types';

interface Props {
  params: SimulationParams;
}

export const SlitBarrier: React.FC<Props> = ({ params }) => {
  // Visual dimensions
  const wallHeight = 10;
  const wallWidth = 20;
  const wallThickness = 0.1;
  const wallZ = -2;

  const { slitSeparation, slitWidth } = params;
  
  // We construct the wall using 3 pieces: Left Wing, Center Post, Right Wing
  
  // Center Post
  const centerPostWidth = slitSeparation - slitWidth;
  // If slitSeparation < slitWidth, they merge, but let's assume valid input logic limits this.
  const renderCenter = centerPostWidth > 0;

  const wingWidth = (wallWidth - slitSeparation - slitWidth) / 2;
  const wingOffset = (slitSeparation + slitWidth) / 2 + wingWidth / 2;

  return (
    <group position={[0, 0, wallZ]}>
      {/* Left Wing */}
      <mesh position={[-wingOffset, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[wingWidth, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[wingOffset, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[wingWidth, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Center Post (The space between slits) */}
      {renderCenter && (
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[centerPostWidth, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
        </mesh>
      )}
      
      {/* Top and Bottom covers to frame the slits vertically (optional but looks better) */}
      <mesh position={[0, wallHeight/2 + 1, 0]}>
         <boxGeometry args={[wallWidth, 2, wallThickness]} />
         <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
      </mesh>
       <mesh position={[0, -(wallHeight/2 + 1), 0]}>
         <boxGeometry args={[wallWidth, 2, wallThickness]} />
         <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
};
