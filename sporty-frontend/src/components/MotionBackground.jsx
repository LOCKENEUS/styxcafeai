import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const MotionBackground = () => {
  const [currentScene, setCurrentScene] = useState(0);
  
  const scenes = [
    {
      gradient: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(184, 41, 255, 0.15), transparent 50%)',
      particles: [
        { icon: '⚽', x: '10%', y: '20%', duration: 8 },
        { icon: '🏀', x: '80%', y: '70%', duration: 10 },
        { icon: '🎾', x: '50%', y: '50%', duration: 12 },
      ]
    },
    {
      gradient: 'radial-gradient(circle at 70% 30%, rgba(255, 41, 212, 0.15), transparent 50%), radial-gradient(circle at 30% 70%, rgba(0, 255, 136, 0.15), transparent 50%)',
      particles: [
        { icon: '🏏', x: '20%', y: '60%', duration: 9 },
        { icon: '🏸', x: '70%', y: '30%', duration: 11 },
        { icon: '⚽', x: '45%', y: '80%', duration: 7 },
      ]
    },
    {
      gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 170, 0, 0.15), transparent 60%), radial-gradient(circle at 90% 20%, rgba(0, 212, 255, 0.15), transparent 50%)',
      particles: [
        { icon: '🏀', x: '15%', y: '40%', duration: 10 },
        { icon: '🎾', x: '75%', y: '65%', duration: 8 },
        { icon: '🏸', x: '40%', y: '25%', duration: 12 },
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 8000); // Change scene every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentSceneData = scenes[currentScene];

  return (
    <div className="fixed inset-0 z-0">
      {/* Animated Gradient Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            background: currentSceneData.gradient,
          }}
        />
      </AnimatePresence>

      {/* Floating Sport Icons */}
      <AnimatePresence mode="wait">
        {currentSceneData.particles.map((particle, index) => (
          <motion.div
            key={`${currentScene}-${index}`}
            initial={{ 
              opacity: 0, 
              x: particle.x, 
              y: particle.y,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 0.3, 0.3, 0],
              x: [particle.x, `calc(${particle.x} + 50px)`, particle.x],
              y: [particle.y, `calc(${particle.y} - 100px)`, particle.y],
              scale: [0, 1.5, 1.5, 0],
              rotate: [0, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute text-6xl md:text-8xl blur-sm pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
            }}
          >
            {particle.icon}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default MotionBackground;
