import React, { useRef, useMemo } from 'react';
import { ShaderMaterial, Color, DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';
import { SimulationParams } from '../types';

// Physics Shader to calculate Intensity I(x) = sinc²(β) * cos²(α)
// α = (π * d * x) / (λ * L)
// β = (π * a * x) / (λ * L)
const fragmentShader = `
varying vec2 vUv;
uniform float uWavelength;
uniform float uSlitSeparation;
uniform float uSlitWidth;
uniform float uScreenDistance;
uniform vec3 uColor;
uniform float uTime;

#define PI 3.14159265359

void main() {
    // Map UV (0 to 1) to X coordinate centered at 0 (-10 to 10 appx)
    float x = (vUv.x - 0.5) * 20.0; 
    
    // Scale factors to make the visual representation intuitive in 3D space
    // These constants adjust the math to fit the 3D scene scale units
    float scaleFactor = 500.0; 
    
    // Parameters
    float lambda = uWavelength * 0.001; // Scale nm roughly
    float d = uSlitSeparation;
    float a = uSlitWidth;
    float L = uScreenDistance;
    
    // Interference term (Double Slit)
    float alpha = (PI * d * x * scaleFactor) / (lambda * L);
    float interference = pow(cos(alpha), 2.0);
    
    // Diffraction term (Single Slit envelope)
    float beta = (PI * a * x * scaleFactor) / (lambda * L);
    float diffraction = 1.0;
    if (abs(beta) > 0.001) {
        diffraction = pow(sin(beta) / beta, 2.0);
    }
    
    float intensity = interference * diffraction;
    
    // Add a subtle "scanline" or noise effect to make it look like a detector screen
    float noise = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    intensity = intensity + (noise * 0.05);

    // Falloff at edges of screen
    float vignette = smoothstep(0.5, 0.4, abs(vUv.y - 0.5)) * smoothstep(0.5, 0.4, abs(vUv.x - 0.5));
    
    vec3 finalColor = uColor * intensity * vignette;
    
    // Base glow
    finalColor += uColor * 0.1 * vignette;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

interface Props {
  params: SimulationParams;
  color: string;
}

export const InterferenceScreen: React.FC<Props> = ({ params, color }) => {
  const materialRef = useRef<ShaderMaterial>(null);
  
  // Convert hex color to THREE.Color
  const threeColor = useMemo(() => new Color(color), [color]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uWavelength.value = params.wavelength;
      materialRef.current.uniforms.uSlitSeparation.value = params.slitSeparation;
      materialRef.current.uniforms.uSlitWidth.value = params.slitWidth;
      materialRef.current.uniforms.uScreenDistance.value = params.screenDistance;
      materialRef.current.uniforms.uColor.value = threeColor;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uWavelength: { value: params.wavelength },
    uSlitSeparation: { value: params.slitSeparation },
    uSlitWidth: { value: params.slitWidth },
    uScreenDistance: { value: params.screenDistance },
    uColor: { value: threeColor },
    uTime: { value: 0 }
  }), [threeColor, params.wavelength, params.slitSeparation, params.slitWidth, params.screenDistance]);

  return (
    <mesh position={[0, 0, params.screenDistance / 2]} receiveShadow>
      <planeGeometry args={[20, 8]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={DoubleSide}
      />
    </mesh>
  );
};