import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeColor } from '../types';

// --- FLOATING LANTERNS ---
const Lanterns: React.FC<{ count: number }> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initial random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() * 0.02;
      const xFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40; // Surround the scene
      const yStart = -10 + Math.random() * 20;
      temp.push({ t, factor, speed, xFactor, zFactor, y: yStart });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      let { t, speed, xFactor, zFactor, y } = particle;
      
      // Update position
      particle.y += speed;
      // Reset if too high
      if (particle.y > 20) particle.y = -10;

      // Gentle wave motion
      const x = xFactor + Math.sin(t * 0.1 + particle.y) * 2;
      const z = zFactor + Math.cos(t * 0.1 + particle.y) * 2;
      
      dummy.position.set(x, particle.y, z);
      
      // Gentle flicker/scale
      const scale = 0.5 + Math.sin(t * 2) * 0.05;
      dummy.scale.set(scale, scale * 1.5, scale); // Lantern shape
      
      dummy.rotation.y = Math.sin(t * 0.5) * 0.2;
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      particle.t += 0.01;
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow={false}>
      <cylinderGeometry args={[0.2, 0.15, 0.4, 8, 1, true]} />
      <meshStandardMaterial 
        color="#FFD700" 
        emissive="#FF4500" 
        emissiveIntensity={2} 
        transparent 
        opacity={0.8} 
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};

// --- GIANT MOON ---
const CrescentMoon: React.FC = () => {
  return (
    <group position={[8, 12, -20]} rotation={[0, 0, Math.PI / 8]}>
      {/* Main glowing sphere */}
      <mesh>
        <sphereGeometry args={[8, 64, 64]} />
        <meshStandardMaterial 
            color="#FFFDD0" 
            emissive="#FDFBD3" 
            emissiveIntensity={0.6} 
            roughness={0.8}
            fog={false} 
        />
      </mesh>
      {/* Backlight halo */}
      <pointLight intensity={1.5} distance={50} color="#FDFBD3" />
    </group>
  );
};

// --- DEDICATION TEXT ---
const DedicationText: React.FC = () => {
  return (
    <group position={[0, 0.1, 4.5]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <Text
          font="https://fonts.gstatic.com/s/allura/v21/9oRPNYsQpS4zjuAPjAI.woff" // Elegant cursive font
          fontSize={0.8}
          letterSpacing={0.1}
          lineHeight={1}
          color={ThemeColor.GOLD}
          anchorX="center"
          anchorY="middle"
        >
          For Ding Tong
          <meshStandardMaterial 
            color={ThemeColor.GOLD} 
            emissive={ThemeColor.GOLD} 
            emissiveIntensity={0.8} 
            toneMapped={false}
          />
        </Text>
        {/* Shadow/Glow under text */}
        <Text
           font="https://fonts.gstatic.com/s/allura/v21/9oRPNYsQpS4zjuAPjAI.woff"
           fontSize={0.8}
           position={[0, 0, -0.05]}
           color="#000"
           fillOpacity={0.5}
           anchorX="center"
           anchorY="middle"
        >
            For Ding Tong
        </Text>
      </Float>
    </group>
  );
};

const BackgroundDecorations: React.FC = () => {
  return (
    <group>
      <Lanterns count={40} />
      <CrescentMoon />
      <DedicationText />
    </group>
  );
};

export default BackgroundDecorations;