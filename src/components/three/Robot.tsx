import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Robot = () => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Memoize materials for better performance and consistency
  const materials = useMemo(
    () => ({
      metal: new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.1,
        metalness: 0.9,
        emissive: "#000000",
      }),
      glowBlue: new THREE.MeshStandardMaterial({
        color: "#00f3ff",
        emissive: "#00f3ff",
        emissiveIntensity: 2,
        toneMapped: false,
      }),
      glowPurple: new THREE.MeshStandardMaterial({
        color: "#bc13fe",
        emissive: "#bc13fe",
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: "#050505",
        roughness: 0.5,
      }),
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (headRef.current) {
      // Smoother mouse tracking
      const target = new THREE.Vector3(state.mouse.x * 2, state.mouse.y * 2, 2);
      headRef.current.lookAt(target);
    }

    if (bodyRef.current) {
      // More dynamic floating
      bodyRef.current.position.y = Math.sin(t * 0.8) * 0.1;
      bodyRef.current.rotation.y = Math.sin(t * 0.4) * 0.05;
    }

    if (coreRef.current) {
      // Pulsing core effect
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      (
        coreRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = 2 + Math.sin(t * 2) * 1;
    }
  });

  return (
    <group ref={bodyRef} position={[0, -0.2, 0]} scale={[1, 1, 1]}>
      {/* --- HEAD --- */}
      <group ref={headRef} position={[0, 1.2, 0]}>
        {/* Main Head */}
        <mesh material={materials.metal}>
          <boxGeometry args={[0.7, 0.5, 0.5]} />
        </mesh>

        {/* Visor */}
        <mesh position={[0, 0.05, 0.26]} material={materials.glowBlue}>
          <boxGeometry args={[0.6, 0.15, 0.02]} />
        </mesh>

        {/* Side "Ears" / Audio Sensors */}
        <mesh
          position={[0.36, 0, 0]}
          material={materials.metal}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        </mesh>
        <mesh
          position={[-0.36, 0, 0]}
          material={materials.metal}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        </mesh>

        {/* Antennas */}
        <group position={[0.2, 0.25, 0]}>
          <mesh material={materials.dark}>
            <cylinderGeometry args={[0.01, 0.01, 0.4]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} material={materials.glowPurple}>
            <sphereGeometry args={[0.03, 16, 16]} />
          </mesh>
        </group>
        <group position={[-0.2, 0.25, 0]}>
          <mesh material={materials.dark}>
            <cylinderGeometry args={[0.01, 0.01, 0.4]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} material={materials.glowPurple}>
            <sphereGeometry args={[0.03, 16, 16]} />
          </mesh>
        </group>
      </group>

      {/* --- NECK (Segmented) --- */}
      <group position={[0, 0.85, 0]}>
        <mesh material={materials.dark} position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05]} />
        </mesh>
        <mesh material={materials.dark} position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05]} />
        </mesh>
      </group>

      {/* --- TORSO --- */}
      <group position={[0, 0.3, 0]}>
        {/* Main Chest Plate */}
        <mesh material={materials.metal}>
          <boxGeometry args={[0.9, 1, 0.5]} />
        </mesh>

        {/* Glowing Core */}
        <mesh
          ref={coreRef}
          position={[0, 0.2, 0.26]}
          material={materials.glowBlue}
        >
          <octahedronGeometry args={[0.15, 0]} />
        </mesh>

        {/* Mechanical Detail (Ribs) */}
        {[0, -0.15, -0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0.26]} material={materials.dark}>
            <boxGeometry args={[0.6, 0.05, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* --- SHOULDERS & ARMS --- */}
      {[1, -1].map((side) => (
        <group key={side} position={[side * 0.55, 0.65, 0]}>
          {/* Shoulder Joint */}
          <mesh material={materials.metal}>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>
          {/* Upper Arm */}
          <group position={[side * 0.1, -0.2, 0]} rotation={[0, 0, side * 0.2]}>
            <mesh material={materials.metal}>
              <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
            </mesh>
            {/* Elbow */}
            <mesh position={[0, -0.25, 0]} material={materials.dark}>
              <sphereGeometry args={[0.08, 16, 16]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Internal Light for Glow */}
      <pointLight
        position={[0, 0.2, 0.3]}
        color="#00f3ff"
        intensity={2}
        distance={2}
      />
    </group>
  );
};
