import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  Sparkles, 
  ContactShadows, 
  PerspectiveCamera 
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import ChristmasTree from './ChristmasTree';
import { ChiikawaCharacter } from './ChiikawaCharacter';
import BackgroundDecorations from './BackgroundDecorations';
import { WoodenSign } from './WoodenSign';

interface SceneProps {
  lightsOn: boolean;
  rotationSpeed: number;
  isScattered: boolean;
}

const Scene: React.FC<SceneProps> = ({ lightsOn, rotationSpeed, isScattered }) => {
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      gl={{ antialias: false, toneMappingExposure: 1.1 }}
    >
      <PerspectiveCamera makeDefault position={[0, 3, 14]} fov={45} />
      
      {/* Dark Midnight Blue Background to contrast with White Tree */}
      <color attach="background" args={['#050510']} />
      
      {/* Lighting - Cooler and softer for "Snow/White" look */}
      <ambientLight intensity={0.4} color="#eef" />
      
      {/* Main warm light */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={lightsOn ? 2.0 : 0.5} 
        castShadow 
        color="#fff5e6"
        shadow-bias={-0.0001}
      />
      
      {/* Fill light (Blueish) */}
      <pointLight position={[-10, 5, -10]} intensity={1.5} color="#b3d9ff" />
      
      {/* Rim light (Pinkish) */}
      <spotLight position={[-5, 5, -5]} intensity={2} color="#ffccd5" distance={15} />

      {/* Environment for shiny reflections */}
      <Environment preset="city" />

      {/* Floating Particles - Multi-colored pastel */}
      <Sparkles 
        count={200} 
        scale={12} 
        size={4} 
        speed={0.3} 
        opacity={0.6} 
        color="#FFF" 
      />
      
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

      <group position={[0, -2.5, 0]}>
          
          {/* PRIORITY 1: MAIN TREE & CHARACTER - Should render immediately */}
          <Suspense fallback={null}>
             <ChristmasTree 
                lightsOn={lightsOn} 
                rotationSpeed={rotationSpeed} 
                isScattered={isScattered}
             />
             {!isScattered && <ChiikawaCharacter />}
             <ContactShadows opacity={0.5} scale={15} blur={2.5} far={4} color="#000000" />
          </Suspense>

          {/* PRIORITY 2: WOODEN SIGN - Uses Font, might take time */}
          <Suspense fallback={null}>
             {!isScattered && <WoodenSign />}
          </Suspense>

          {/* PRIORITY 3: BACKGROUND ELEMENTS - Uses Font, might take time */}
          <Suspense fallback={null}>
             <BackgroundDecorations />
          </Suspense>
          
      </group>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={5}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={isScattered ? rotationSpeed * 0.2 : rotationSpeed} 
      />

      {/* Post Processing - Softer Bloom */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.85} 
          mipmapBlur 
          intensity={1.0} 
          radius={0.6} 
        />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;