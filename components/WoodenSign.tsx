import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeColor } from '../types';

export const WoodenSign: React.FC = () => {
  // Materials
  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#3E2723", // Dark Walnut
    roughness: 0.8,
    metalness: 0.1
  }), []);

  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: ThemeColor.GOLD, 
    roughness: 0.2,
    metalness: 0.9,
    emissive: ThemeColor.GOLD,
    emissiveIntensity: 0.2
  }), []);

  return (
    <group position={[-2.5, 0, 1.8]} rotation={[0, 0.4, 0]}>
      {/* --- LEGS --- */}
      <mesh position={[-0.4, 0.6, 0]} castShadow>
         <boxGeometry args={[0.08, 1.2, 0.08]} />
         <primitive object={woodMaterial} />
      </mesh>
      <mesh position={[0.4, 0.6, 0]} castShadow>
         <boxGeometry args={[0.08, 1.2, 0.08]} />
         <primitive object={woodMaterial} />
      </mesh>

      {/* --- BOARD FRAME (Gold) --- */}
      <mesh position={[0, 1.1, 0]} castShadow>
         <boxGeometry args={[1.5, 0.9, 0.06]} />
         <primitive object={goldMaterial} />
      </mesh>

      {/* --- BOARD INNER (Wood) --- */}
      <mesh position={[0, 1.1, 0.02]} receiveShadow>
         <boxGeometry args={[1.35, 0.75, 0.06]} />
         <primitive object={woodMaterial} />
      </mesh>

      {/* --- TEXT --- */}
      {/* Using Noto Serif SC for elegant Chinese support */}
      <Text
        font="https://fonts.gstatic.com/s/notoserifsc/v21/H4cjBXCAh3n4i76W-o87yd-wP5_x.woff2"
        fontSize={0.18}
        color={ThemeColor.GOLD}
        position={[0, 1.12, 0.06]}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        textAlign="center"
        maxWidth={1.2}
      >
        献给你
        {'\n'}
        <meshStandardMaterial color={ThemeColor.GOLD} emissive={ThemeColor.GOLD} emissiveIntensity={0.5} toneMapped={false} />
      </Text>
      
      <Text
        font="https://fonts.gstatic.com/s/notoserifsc/v21/H4cjBXCAh3n4i76W-o87yd-wP5_x.woff2"
        fontSize={0.12}
        color={ThemeColor.GOLD}
        position={[0, 1.0, 0.06]} // Slightly below
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        亲爱的
        <meshStandardMaterial color={ThemeColor.GOLD} emissive={ThemeColor.GOLD} emissiveIntensity={0.5} toneMapped={false} />
      </Text>

      {/* --- DECORATIVE RIBBON ON TOP --- */}
      <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI/4]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color={ThemeColor.RUBY} />
      </mesh>
    </group>
  );
};