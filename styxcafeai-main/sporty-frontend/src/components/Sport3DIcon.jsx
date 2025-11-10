import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// 3D Sphere Component
function FloatingSphere({ color }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
      // Rotation
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      
      // Scale on hover
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

const Sport3DIcon = ({ sport }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="glass p-4 h-48 flex flex-col items-center justify-center">
        {/* 3D Canvas */}
        <div className="w-full h-32">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <FloatingSphere color={sport.color} />
          </Canvas>
        </div>

        {/* Sport Name */}
        <p className="text-white font-semibold mt-2">{sport.name}</p>
      </div>

      {/* Decorative Glow */}
      <div
        className="absolute inset-0 blur-xl opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${sport.color}, transparent 70%)`
        }}
      />
    </motion.div>
  );
};

export default Sport3DIcon;
