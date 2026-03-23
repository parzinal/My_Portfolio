"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Sphere, TorusKnot } from "@react-three/drei";

export function SceneCanvas() {
  return (
    <div className="h-[340px] w-full rounded-3xl border border-ink/10 bg-gradient-to-br from-ember/20 via-paper to-clay/20 shadow-card md:h-[420px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 3, 2]} intensity={2.4} />

        <Float speed={1.5} rotationIntensity={1.4} floatIntensity={1.8}>
          <TorusKnot args={[1, 0.28, 180, 20]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#d3643b" roughness={0.16} metalness={0.5} />
          </TorusKnot>
        </Float>

        <Float speed={2.2} rotationIntensity={1.2} floatIntensity={2.4}>
          <Sphere args={[0.45, 48, 48]} position={[-1.9, 1.25, -1]}>
            <meshStandardMaterial color="#21473f" roughness={0.2} metalness={0.7} />
          </Sphere>
        </Float>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.3} />
      </Canvas>
    </div>
  );
}
