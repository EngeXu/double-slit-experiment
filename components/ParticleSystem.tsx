import React, { useRef, useMemo, useEffect } from 'react';
import { InstancedMesh, Object3D, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import { SimulationParams } from '../types';

interface Props {
  params: SimulationParams;
  color: string;
}

export const ParticleSystem: React.FC<Props> = ({ params, color }) => {
  const count = params.particleCount;
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  // Store particle data: x, y, z, velocityX, velocityY, velocityZ, state (0=source-to-wall, 1=wall-to-screen)
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 1, // Start slightly scattered at source
        y: (Math.random() - 0.5) * 1,
        z: -10, // Start behind the wall
        vx: 0,
        vy: 0,
        vz: 0.1 + Math.random() * 0.05, // Base speed
        state: 0, // 0: Pre-slit, 1: Post-slit
        slitChoice: 0 // -1 left, 1 right
      });
    }
    return data;
  }, [count]);

  useEffect(() => {
    // Reset particles when critical params change strongly to avoid visual artifacts
    particles.forEach(p => {
       p.z = -10 - Math.random() * 10;
       p.state = 0;
    });
  }, [params.slitSeparation, particles]);

  useFrame(() => {
    if (!meshRef.current || !params.isPlaying) return;

    // Wall Z position is roughly -2 (visual placement)
    const wallZ = -2;
    const screenZ = params.screenDistance / 2;
    const slitGapHalf = params.slitSeparation / 2;

    particles.forEach((p, i) => {
      // UPDATE POSITIONS
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // STATE 0: Moving towards wall
      if (p.state === 0) {
        // Target one of the slits loosely
        const targetSlit = (i % 2 === 0) ? -slitGapHalf : slitGapHalf;
        
        // Simple homing to slit for visual flow
        const distToWall = wallZ - p.z;
        if (distToWall > 0) {
           p.vx = (targetSlit - p.x) / (distToWall / p.vz);
           p.vy = (0 - p.y) / (distToWall / p.vz);
        }

        // Hit Wall check
        if (p.z >= wallZ) {
          p.state = 1;
          p.z = wallZ + 0.1;
          // Reset position to exactly the slit to prevent clipping
          p.x = targetSlit + (Math.random() - 0.5) * params.slitWidth; 
          p.y = (Math.random() - 0.5) * 0.5; // Height of slit
          
          // DIFFRACTION / INTERFERENCE ANGLE CALCULATION
          // We need to pick an angle theta based on the probability distribution I(theta)
          
          const lambda = params.wavelength * 0.001;
          const L = params.screenDistance;
          const d = params.slitSeparation;
          const a = params.slitWidth;
          const scaleFactor = 500.0;
          
          // Try to find a valid target X using rejection sampling
          let valid = false;
          let targetX = 0;
          let attempts = 0;
          
          while(!valid && attempts < 10) {
             targetX = (Math.random() - 0.5) * 20; // Random point on screen
             
             // Interference term (Double Slit)
             const alpha = (Math.PI * d * targetX * scaleFactor) / (lambda * L);
             const interference = Math.pow(Math.cos(alpha), 2);

             // Diffraction term (Single Slit envelope)
             const beta = (Math.PI * a * targetX * scaleFactor) / (lambda * L);
             let diffraction = 1.0;
             if (Math.abs(beta) > 0.001) {
                 diffraction = Math.pow(Math.sin(beta) / beta, 2);
             }

             const prob = interference * diffraction;
             
             // Monte Carlo rejection
             if (Math.random() < prob) {
                 valid = true;
             }
             attempts++;
          }

          // Calculate velocity vector to reach that targetX at screenZ
          const totalTime = (screenZ - wallZ) / p.vz;
          p.vx = (targetX - p.x) / totalTime;
          p.vy = ((Math.random() - 0.5) * 4 - p.y) / totalTime; // Spread Y a bit
        }
      } 
      // STATE 1: Moving to Screen
      else if (p.state === 1) {
        if (p.z > screenZ) {
          // Reset to beginning
          p.z = -10 - Math.random() * 5;
          p.state = 0;
          p.vx = 0;
          p.vy = 0;
        }
      }

      // Update Instance Matrix
      dummy.position.set(p.x, p.y, p.z);
      
      // Scale down slightly
      const s = 0.08;
      dummy.scale.set(s, s, s);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const threeColor = useMemo(() => new Color(color), [color]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={threeColor} toneMapped={false} />
    </instancedMesh>
  );
};