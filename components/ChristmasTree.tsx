import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemeColor } from '../types';

interface ChristmasTreeProps {
  lightsOn: boolean;
  rotationSpeed: number;
  isScattered: boolean;
}

// --- MATH HELPERS ---

const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- INSTANCED COMPONENTS ---

interface MorphingInstancesProps {
  count: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  getTreeTransform: (i: number) => { pos: THREE.Vector3; scale: number; rot: THREE.Euler };
  getScatterTransform: (i: number) => { pos: THREE.Vector3; scale: number; rot: THREE.Euler };
  isScattered: boolean;
  emissive?: boolean;
  lightsOn?: boolean;
}

const MorphingInstances: React.FC<MorphingInstancesProps> = ({ 
  count, 
  geometry, 
  material, 
  getTreeTransform, 
  getScatterTransform, 
  isScattered,
  emissive = false,
  lightsOn = true
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate both states
  const { treeTransforms, scatterTransforms } = useMemo(() => {
    const tree = [];
    const scatter = [];
    for (let i = 0; i < count; i++) {
      tree.push(getTreeTransform(i));
      scatter.push(getScatterTransform(i));
    }
    return { treeTransforms: tree, scatterTransforms: scatter };
  }, [count, getTreeTransform, getScatterTransform]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const lerpFactor = 0.05; 
    
    for (let i = 0; i < count; i++) {
      const treeT = treeTransforms[i];
      const scatterT = scatterTransforms[i];

      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      const targetPos = isScattered ? scatterT.pos : treeT.pos;
      const targetScale = isScattered ? scatterT.scale : treeT.scale;
      
      dummy.position.lerp(targetPos, lerpFactor * (1 + i % 5 * 0.1));
      
      const currentScaleScalar = dummy.scale.x; 
      const nextScale = THREE.MathUtils.lerp(currentScaleScalar, targetScale, lerpFactor);
      dummy.scale.setScalar(nextScale);

      if (isScattered) {
          dummy.rotation.x += 0.01 * (i%2===0?1:-1);
          dummy.rotation.y += 0.01 * (i%3===0?1:-1);
      } else {
         const targetRot = new THREE.Quaternion().setFromEuler(treeT.rot);
         dummy.quaternion.slerp(targetRot, lerpFactor);
      }
      
      if (!isScattered) {
          const breath = Math.sin(t * 1.5 + i) * 0.015;
          dummy.position.y += breath;
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    if (emissive && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
         const targetIntensity = lightsOn ? (isScattered ? 1 : 2) : 0;
         meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
             meshRef.current.material.emissiveIntensity, 
             targetIntensity, 
             0.1
         );
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} castShadow receiveShadow />
  );
};

// --- CUSTOM DECORATION: BLUE RIBBON COOKIES ---
const BlueRibbonCookie: React.FC<{ 
    targetPos: THREE.Vector3; 
    scatterPos: THREE.Vector3; 
    isScattered: boolean; 
}> = ({ targetPos, scatterPos, isScattered }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(!groupRef.current) return;
        const target = isScattered ? scatterPos : targetPos;
        groupRef.current.position.lerp(target, 0.05);
        
        if(isScattered) {
            groupRef.current.rotation.x += 0.02;
            groupRef.current.rotation.y += 0.02;
        } else {
            groupRef.current.lookAt(0, targetPos.y, 0); 
            groupRef.current.rotateY(Math.PI); 
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
        
        const s = isScattered ? 0.8 : 1.2;
        groupRef.current.scale.lerp(new THREE.Vector3(s,s,s), 0.1);
    });

    const cookieMat = new THREE.MeshStandardMaterial({ color: ThemeColor.COOKIE_BROWN, roughness: 0.8 });
    const ribbonMat = new THREE.MeshStandardMaterial({ color: ThemeColor.HACHIWARE_BLUE, roughness: 0.4 });

    return (
        <group ref={groupRef}>
            <mesh rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
                <primitive object={cookieMat} />
            </mesh>
            <mesh position={[-0.1, 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                <primitive object={cookieMat} />
            </mesh>
            <mesh position={[0.1, 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                <primitive object={cookieMat} />
            </mesh>
            <mesh position={[0.08, -0.08, 0.025]} rotation={[0, 0, Math.PI/4]}>
                 <boxGeometry args={[0.06, 0.12, 0.02]} />
                 <primitive object={ribbonMat} />
            </mesh>
            <mesh position={[-0.08, -0.08, 0.025]} rotation={[0, 0, -Math.PI/4]}>
                 <boxGeometry args={[0.06, 0.12, 0.02]} />
                 <primitive object={ribbonMat} />
            </mesh>
        </group>
    )
}

// --- GIFT BOXES AROUND TRUNK ---
const GiftBoxes: React.FC<{ isScattered: boolean }> = ({ isScattered }) => {
    const boxes = useMemo(() => {
        const items = [];
        const colors = [ThemeColor.RUBY, ThemeColor.GOLD, ThemeColor.HACHIWARE_BLUE, ThemeColor.CHIIKAWA_PINK];
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = 1.2 + Math.random() * 0.5;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const scale = 0.3 + Math.random() * 0.2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            items.push({ x, z, scale, color, rot: Math.random() * Math.PI });
        }
        return items;
    }, []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if(!groupRef.current) return;
        const targetScale = isScattered ? 0 : 1;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
    });

    return (
        <group ref={groupRef} position={[0, 0.2, 0]}>
            {boxes.map((box, i) => (
                <group key={i} position={[box.x, 0, box.z]} rotation={[0, box.rot, 0]} scale={box.scale}>
                    <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color={box.color} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 0.5, 0]} scale={[1.02, 1, 0.2]}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="#FFF" />
                    </mesh>
                    <mesh position={[0, 0.5, 0]} scale={[0.2, 1, 1.02]}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="#FFF" />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

// --- STAR TOPPER ---
const StarTopper: React.FC<{ isScattered: boolean, lightsOn: boolean }> = ({ isScattered, lightsOn }) => {
    const meshRef = useRef<THREE.Group>(null);
    // Increased Y height to 5.6 to clear the top spheres
    const targetPos = useMemo(() => new THREE.Vector3(0, 5.6, 0), []); 
    const scatterPos = useMemo(() => randomInSphere(8), []);
    
    const starMat = useMemo(() => new THREE.MeshStandardMaterial({ 
        color: ThemeColor.GOLD, 
        roughness: 0.1, 
        metalness: 1.0,
        emissive: ThemeColor.GOLD,
        emissiveIntensity: 0.5
    }), []);

    useFrame((state) => {
        if(!meshRef.current) return;
        const target = isScattered ? scatterPos : targetPos;
        meshRef.current.position.lerp(target, 0.05);
        meshRef.current.rotation.y += 0.01;
        
        // Increased Scale to 1.8 to be prominent
        const s = isScattered ? 0.5 : 1.8;
        meshRef.current.scale.lerp(new THREE.Vector3(s,s,s), 0.1);
        
        if (meshRef.current.children[0] instanceof THREE.Mesh) {
            (meshRef.current.children[0].material as THREE.MeshStandardMaterial).emissiveIntensity = lightsOn ? 2 : 0.2;
        }
    });

    return (
        <group ref={meshRef}>
            <mesh castShadow>
                <octahedronGeometry args={[0.4, 0]} />
                <primitive object={starMat} />
            </mesh>
            <pointLight distance={3} intensity={lightsOn ? 2 : 0} color={ThemeColor.GOLD} />
        </group>
    )
}

// --- MAIN TREE COMPONENT ---

const ChristmasTree: React.FC<ChristmasTreeProps> = ({ lightsOn, isScattered }) => {
  
  // 1. FOLIAGE
  const foliageGeo = useMemo(() => new THREE.IcosahedronGeometry(0.12, 0), []); 
  const whiteFoliageMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ThemeColor.CHIIKAWA_WHITE, roughness: 0.5, metalness: 0.1 }), []);
  const greenFoliageMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ThemeColor.EMERALD, roughness: 0.4, metalness: 0.3 }), []);
  const pinkFoliageMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ThemeColor.CHIIKAWA_PINK, roughness: 0.5, metalness: 0.1 }), []);

  const getFoliageTreePos = (i: number) => {
    const layer = i % 3;
    let h, rBottom, rTop, yOffset;
    if (layer === 0) { h=1.8; rBottom=2.2; rTop=1.4; yOffset=0.8; }
    else if (layer === 1) { h=1.8; rBottom=1.6; rTop=0.9; yOffset=2.2; }
    else { h=1.5; rBottom=1.1; rTop=0.2; yOffset=3.6; }

    const v = Math.random();
    const y = v * h;
    const currentR = rBottom + (rTop - rBottom) * v;
    const r = currentR * Math.sqrt(0.8 + Math.random() * 0.2); 
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    
    return { 
        pos: new THREE.Vector3(x, y + yOffset, z), 
        scale: 0.8 + Math.random() * 0.5, 
        rot: new THREE.Euler(Math.random(), Math.random(), Math.random()) 
    };
  };

  // 2. ORNAMENTS
  const ornamentGeo = useMemo(() => new THREE.SphereGeometry(0.14, 16, 16), []);
  const blueMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ThemeColor.HACHIWARE_BLUE, roughness: 0.2, metalness: 0.7 }), []);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ThemeColor.GOLD, roughness: 0.1, metalness: 1.0 }), []);

  const getSpiralPos = (i: number, count: number, offsetRad: number = 0) => {
    const yStart = 1.0;
    const yEnd = 4.8;
    const progress = i / count;
    const y = yStart + progress * (yEnd - yStart);
    const rAtHeight = 2.0 * (1 - progress * 0.95); 
    const theta = i * 2.39996 + offsetRad;
    const x = Math.cos(theta) * rAtHeight;
    const z = Math.sin(theta) * rAtHeight;
    return { 
        pos: new THREE.Vector3(x, y, z), 
        scale: 1, 
        rot: new THREE.Euler(0, -theta, 0) 
    };
  };

  const hatGeo = useMemo(() => new THREE.ConeGeometry(0.12, 0.25, 16), []);
  const redMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ThemeColor.RUBY, roughness: 0.3, metalness: 0.2 }), []);

  const getCommonScatterPos = () => ({
    pos: randomInSphere(8), 
    scale: 0.5 + Math.random(), 
    rot: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0)
  });

  const cookies = useMemo(() => {
      const items = [];
      for(let i=0; i<8; i++) {
          items.push({
            target: getSpiralPos(i, 8, 2.0).pos, 
            scatter: randomInSphere(8)
          });
      }
      return items;
  }, []);

  return (
    <group>
        {/* Base Trunk */}
        <mesh position={[0, 0.4, 0]} receiveShadow>
            <cylinderGeometry args={[0.5, 0.7, 1.2, 32]} />
            <meshStandardMaterial color="#3d2817" metalness={0.1} roughness={0.8} />
        </mesh>
        
        <GiftBoxes isScattered={isScattered} />
        
        <MorphingInstances
            count={1000}
            geometry={foliageGeo}
            material={whiteFoliageMat}
            getTreeTransform={getFoliageTreePos}
            getScatterTransform={getCommonScatterPos}
            isScattered={isScattered}
        />
        <MorphingInstances
            count={500}
            geometry={foliageGeo}
            material={greenFoliageMat}
            getTreeTransform={(i) => getFoliageTreePos(i + 1000)} 
            getScatterTransform={getCommonScatterPos}
            isScattered={isScattered}
        />
        <MorphingInstances
            count={300}
            geometry={foliageGeo}
            material={pinkFoliageMat}
            getTreeTransform={(i) => getFoliageTreePos(i + 1500)} 
            getScatterTransform={getCommonScatterPos}
            isScattered={isScattered}
        />

        <MorphingInstances
            count={20}
            geometry={ornamentGeo}
            material={blueMat}
            getTreeTransform={(i) => getSpiralPos(i, 20)}
            getScatterTransform={getCommonScatterPos}
            isScattered={isScattered}
        />
        <MorphingInstances
            count={20}
            geometry={ornamentGeo}
            material={goldMat}
            getTreeTransform={(i) => getSpiralPos(i, 20, 1.0)}
            getScatterTransform={getCommonScatterPos}
            isScattered={isScattered}
        />

        <MorphingInstances
            count={15}
            geometry={hatGeo}
            material={redMat}
            getTreeTransform={(i) => {
                const p = getSpiralPos(i, 15, 3.5);
                p.scale = 1.4; 
                p.rot = new THREE.Euler(0.2, -i*2.39996, 0); 
                return p;
            }}
            getScatterTransform={getCommonScatterPos}
            isScattered={isScattered}
        />

        {cookies.map((c, i) => (
            <BlueRibbonCookie 
                key={i} 
                targetPos={c.target} 
                scatterPos={c.scatter} 
                isScattered={isScattered} 
            />
        ))}

        <MorphingInstances
            count={120}
            geometry={useMemo(() => new THREE.SphereGeometry(0.05, 8, 8), [])}
            material={useMemo(() => new THREE.MeshStandardMaterial({ color: "#FFF", emissive: "#FFFDD0" }), [])}
            getTreeTransform={(i) => {
                 const p = getFoliageTreePos(i + 5000);
                 p.scale = 1;
                 p.pos.multiplyScalar(1.05); 
                 return p;
            }}
            getScatterTransform={getCommonScatterPos}
            isScattered={isScattered}
            emissive={true}
            lightsOn={lightsOn}
        />

        <StarTopper isScattered={isScattered} lightsOn={lightsOn} />

    </group>
  );
};

export default ChristmasTree;