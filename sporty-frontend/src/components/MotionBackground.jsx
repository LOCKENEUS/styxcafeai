import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const MotionBackground = () => {
  const [currentScene, setCurrentScene] = useState(0);
  
  const scenes = [
    {
      name: 'Electric Blue',
      gradient: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.4), transparent 50%), radial-gradient(circle at 80% 80%, rgba(184, 41, 255, 0.4), transparent 50%), linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(184, 41, 255, 0.1))',
      particles: [
        { icon: '⚽', x: '10%', y: '20%', duration: 8, size: 'text-9xl' },
        { icon: '🏀', x: '80%', y: '70%', duration: 10, size: 'text-8xl' },
        { icon: '🎾', x: '50%', y: '50%', duration: 12, size: 'text-7xl' },
        { icon: '🏏', x: '25%', y: '75%', duration: 9, size: 'text-6xl' },
        { icon: '🏸', x: '70%', y: '15%', duration: 11, size: 'text-8xl' },
      ],
      shapes: [
        { size: 400, x: '15%', y: '30%', color: 'rgba(0, 212, 255, 0.15)' },
        { size: 300, x: '75%', y: '60%', color: 'rgba(184, 41, 255, 0.15)' },
      ]
    },
    {
      name: 'Neon Pink',
      gradient: 'radial-gradient(circle at 70% 30%, rgba(255, 41, 212, 0.4), transparent 50%), radial-gradient(circle at 30% 70%, rgba(0, 255, 136, 0.4), transparent 50%), linear-gradient(225deg, rgba(255, 41, 212, 0.1), rgba(0, 255, 136, 0.1))',
      particles: [
        { icon: '🏏', x: '20%', y: '60%', duration: 9, size: 'text-9xl' },
        { icon: '🏸', x: '70%', y: '30%', duration: 11, size: 'text-7xl' },
        { icon: '⚽', x: '45%', y: '80%', duration: 7, size: 'text-8xl' },
        { icon: '🏀', x: '85%', y: '45%', duration: 10, size: 'text-6xl' },
        { icon: '🎾', x: '15%', y: '25%', duration: 8, size: 'text-8xl' },
      ],
      shapes: [
        { size: 350, x: '60%', y: '40%', color: 'rgba(255, 41, 212, 0.15)' },
        { size: 450, x: '25%', y: '70%', color: 'rgba(0, 255, 136, 0.15)' },
      ]
    },
    {
      name: 'Golden Glow',
      gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 170, 0, 0.4), transparent 60%), radial-gradient(circle at 90% 20%, rgba(0, 212, 255, 0.4), transparent 50%), linear-gradient(45deg, rgba(255, 170, 0, 0.1), rgba(0, 212, 255, 0.1))',
      particles: [
        { icon: '🏀', x: '15%', y: '40%', duration: 10, size: 'text-8xl' },
        { icon: '🎾', x: '75%', y: '65%', duration: 8, size: 'text-9xl' },
        { icon: '🏸', x: '40%', y: '25%', duration: 12, size: 'text-7xl' },
        { icon: '⚽', x: '60%', y: '55%', duration: 9, size: 'text-6xl' },
        { icon: '🏏', x: '30%', y: '85%', duration: 11, size: 'text-8xl' },
      ],
      shapes: [
        { size: 380, x: '80%', y: '25%', color: 'rgba(255, 170, 0, 0.15)' },
        { size: 320, x: '35%', y: '55%', color: 'rgba(0, 212, 255, 0.15)' },
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 10000); // Change scene every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const currentSceneData = scenes[currentScene];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Animated Gradient Background with Fade Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`gradient-${currentScene}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            background: currentSceneData.gradient,
          }}
        />
      </AnimatePresence>

      {/* Animated Background Shapes */}
      <AnimatePresence mode="wait">
        {currentSceneData.shapes.map((shape, index) => (
          <motion.div
            key={`shape-${currentScene}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute rounded-full blur-3xl"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
              background: shape.color,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Floating Sport Icons with Enhanced Visibility */}
      <AnimatePresence mode="wait">
        {currentSceneData.particles.map((particle, index) => (
          <motion.div
            key={`particle-${currentScene}-${index}`}
            initial={{ 
              opacity: 0, 
              scale: 0
            }}
            animate={{ 
              opacity: [0, 0.6, 0.6, 0],
              scale: [0, 1.8, 1.8, 0],
              x: [0, 30, -20, 0],
              y: [0, -80, -40, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5
            }}
            className={`absolute ${particle.size} blur-[1px] pointer-events-none`}
            style={{
              left: particle.x,
              top: particle.y,
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
            }}
          >
            {particle.icon}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Animated Mesh Gradient Overlay */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(0, 212, 255, 0.1), transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(184, 41, 255, 0.1), transparent 50%)',
            'radial-gradient(circle at 0% 100%, rgba(255, 41, 212, 0.1), transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(0, 212, 255, 0.1), transparent 50%)',
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute inset-0"
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
    </div>
  );
};

export default MotionBackground;
