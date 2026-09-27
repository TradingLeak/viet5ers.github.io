'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const ATMOSPHERE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
    gl_FragColor = vec4(0.18, 0.9, 0.78, 1.0) * intensity;
  }
`;

/** Procedural planet texture — glowing market-continents on a dark ocean. */
function usePlanetTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const base = ctx.createLinearGradient(0, 0, 0, size);
    base.addColorStop(0, '#06121f');
    base.addColorStop(0.5, '#0a2233');
    base.addColorStop(1, '#02060d');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // Glowing patches
    for (let i = 0; i < 95; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 42 + 5;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const teal = Math.random() > 0.45;
      g.addColorStop(0, teal ? 'rgba(0,212,170,0.32)' : 'rgba(80,150,255,0.22)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Latitude grid
    ctx.strokeStyle = 'rgba(140,220,255,0.05)';
    ctx.lineWidth = 1;
    for (let gy = 0; gy < size; gy += 42) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(size, gy);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function Planet() {
  const texture = usePlanetTexture();
  const surface = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);

  const R = 1.65;
  const ringTilt = Math.PI / 2.3;

  useFrame((_, delta) => {
    if (surface.current) surface.current.rotation.y += delta * 0.1;
    if (spinner.current) spinner.current.rotation.z += delta * 0.22;
  });

  return (
    <group position={[1.75, -0.2, -0.8]}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
        {/* Surface + wireframe */}
        <group ref={surface}>
          <mesh>
            <sphereGeometry args={[R, 64, 64]} />
            <meshStandardMaterial
              map={texture}
              emissive="#00d4aa"
              emissiveMap={texture}
              emissiveIntensity={0.55}
              roughness={0.85}
              metalness={0.15}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[R * 1.004, 24, 24]} />
            <meshBasicMaterial color="#7ff5ff" wireframe transparent opacity={0.06} />
          </mesh>
        </group>

        {/* Atmosphere glow */}
        <mesh>
          <sphereGeometry args={[R * 1.22, 64, 64]} />
          <shaderMaterial
            vertexShader={ATMOSPHERE_VERTEX}
            fragmentShader={ATMOSPHERE_FRAGMENT}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
          />
        </mesh>

        {/* Tilted orbit rings + satellite */}
        <group rotation={[ringTilt, 0, 0.45]}>
          <group ref={spinner}>
            <mesh>
              <torusGeometry args={[R * 1.6, 0.006, 8, 200]} />
              <meshBasicMaterial color="#00d4aa" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh>
              <torusGeometry args={[R * 1.85, 0.004, 8, 200]} />
              <meshBasicMaterial color="#00d4aa" transparent opacity={0.22} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh position={[R * 1.85, 0, 0]}>
              <octahedronGeometry args={[0.085, 0]} />
              <meshStandardMaterial
                color="#eaffff"
                emissive="#00ffcc"
                emissiveIntensity={2.4}
                roughness={0.2}
                metalness={0.6}
              />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
}

/** Mouse-parallax camera rig. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const { pointer } = state;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.16, 2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.09, 2, delta);
  });

  return <group ref={group}>{children}</group>;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.15, 6.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 9, 24]} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[-4, 2.5, 4]} intensity={1.7} color="#bfe9ff" />
        <pointLight position={[4, -2, -4]} intensity={10} color="#00d4aa" distance={14} />

        <Stars radius={90} depth={60} count={4200} factor={3.4} saturation={0} fade speed={0.6} />

        <Rig>
          <Planet />
          <Sparkles count={140} scale={[9, 5.5, 5]} size={2.1} speed={0.35} opacity={0.5} color="#7fffd9" />
        </Rig>

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.95} luminanceThreshold={0.2} luminanceSmoothing={0.75} mipmapBlur />
          <Vignette offset={0.28} darkness={0.82} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
