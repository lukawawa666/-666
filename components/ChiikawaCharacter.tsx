import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemeColor } from '../types';

export const ChiikawaCharacter: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  
  // Materials
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#FFFFFF", 
    roughness: 0.4, 
    metalness: 0.1 
  }), []);
  
  const blushMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#FFB7C5", 
    roughness: 0.6 
  }), []);
  
  const blackMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#1a1a1a", 
    roughness: 0.2 
  }), []);

  const bagMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#FF99AA", // Darker pink for the bear bag
    roughness: 0.3 
  }), []);

  useFrame((state) => {
    if (!groupRef.current || !bodyRef.current) return;
    
    const t = state.clock.elapsedTime;
    
    // Gentle floating/breathing animation
    bodyRef.current.position.y = Math.sin(t * 2) * 0.05;
    
    // Subtle sway
    bodyRef.current.rotation.z = Math.sin(t * 1) * 0.03;
    
    // Make the character look slightly towards the camera/center
    groupRef.current.rotation.y = -0.3 + Math.sin(t * 0.5) * 0.1;
  });

  // Position moved up to Y=2.5 to be next to the middle of the tree
  // Z adjusted slightly forward to clear branches
  return (
    <group ref={groupRef} position={[2.2, 2.5, 1.2]} rotation={[0, -0.3, 0]} scale={1.2}>
      <group ref={bodyRef}>
        {/* --- BODY --- */}
        {/* Main Body: Slightly squashed sphere */}
        <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.7, 32, 32]} />
            <primitive object={skinMat} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.45, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <primitive object={skinMat} />
        </mesh>
        <mesh position={[0.45, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <primitive object={skinMat} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.6, -0.1, 0.1]} rotation={[0, 0, 0.5]} castShadow>
            <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
            <primitive object={skinMat} />
        </mesh>
        <mesh position={[0.6, -0.1, 0.1]} rotation={[0, 0, -0.5]} castShadow>
            <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
            <primitive object={skinMat} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.25, -0.65, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.25, 4, 8]} />
            <primitive object={skinMat} />
        </mesh>
        <mesh position={[0.25, -0.65, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.25, 4, 8]} />
            <primitive object={skinMat} />
        </mesh>
        
        {/* Tail */}
        <mesh position={[0, -0.5, -0.6]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <primitive object={skinMat} />
        </mesh>

        {/* --- FACE --- */}
        {/* Z position increased from 0.62 to 0.68 to push features outside the head sphere */}
        <group position={[0, 0.1, 0.68]}>
             {/* Eyes */}
            <mesh position={[-0.22, 0.05, 0]} scale={[1, 1.1, 0.5]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <primitive object={blackMat} />
            </mesh>
            <mesh position={[0.22, 0.05, 0]} scale={[1, 1.1, 0.5]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <primitive object={blackMat} />
            </mesh>
            
            {/* Eyebrows */}
            <mesh position={[-0.22, 0.18, -0.02]} rotation={[0, 0, 0.1]}>
                <boxGeometry args={[0.1, 0.02, 0.01]} />
                <primitive object={blackMat} />
            </mesh>
            <mesh position={[0.22, 0.18, -0.02]} rotation={[0, 0, -0.1]}>
                <boxGeometry args={[0.1, 0.02, 0.01]} />
                <primitive object={blackMat} />
            </mesh>

            {/* Blush */}
            <mesh position={[-0.35, -0.05, -0.05]} rotation={[0, -0.2, 0]} scale={[1, 0.6, 0.2]}>
                <sphereGeometry args={[0.11, 16, 16]} />
                <primitive object={blushMat} />
            </mesh>
            <mesh position={[0.35, -0.05, -0.05]} rotation={[0, 0.2, 0]} scale={[1, 0.6, 0.2]}>
                <sphereGeometry args={[0.11, 16, 16]} />
                <primitive object={blushMat} />
            </mesh>

            {/* Mouth (W shape simplified to a curve for 3D) */}
            <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI]}>
                 <torusGeometry args={[0.04, 0.015, 8, 16, Math.PI]} />
                 <primitive object={blackMat} />
            </mesh>
        </group>

        {/* --- ACCESSORIES: THE PINK BEAR POCHETTE --- */}
        <group>
            {/* Strap (Diagonal Torus) */}
            <mesh position={[0, -0.1, 0]} rotation={[0, 0, -0.6]} scale={[1.05, 1.05, 1.3]}>
                <torusGeometry args={[0.71, 0.03, 8, 48]} />
                <primitive object={skinMat} /> {/* Strap is usually white string */}
            </mesh>

            {/* The Bear Bag Face */}
            <group position={[0.5, -0.3, 0.45]} rotation={[0, -0.2, 0.1]}>
                {/* Bag Head */}
                <mesh>
                    <sphereGeometry args={[0.2, 24, 24]} />
                    <primitive object={bagMat} />
                </mesh>
                {/* Bag Ears */}
                <mesh position={[-0.15, 0.15, 0]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <primitive object={bagMat} />
                </mesh>
                <mesh position={[0.15, 0.15, 0]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <primitive object={bagMat} />
                </mesh>
                
                {/* Bag Face Details */}
                <mesh position={[0, -0.02, 0.16]} scale={[1, 0.8, 0.5]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#FFE4E1" roughness={0.5} />
                </mesh>
                {/* Bag Eyes */}
                <mesh position={[-0.06, 0.02, 0.18]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <primitive object={blackMat} />
                </mesh>
                <mesh position={[0.06, 0.02, 0.18]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <primitive object={blackMat} />
                </mesh>
                {/* Bag Nose */}
                <mesh position={[0, -0.02, 0.2]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <primitive object={blackMat} />
                </mesh>
            </group>
        </group>

      </group>
      
      {/* Contact Shadow for Chiikawa (Removed/Reduced since it is floating now, or keep distant shadow) */}
    </group>
  );
};