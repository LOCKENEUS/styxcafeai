import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AIGreeting from '../components/AIGreeting';
import MotionBackground from '../components/MotionBackground';
import SportCard from '../components/SportCard';
import GlassBookingPanel from '../components/GlassBookingPanel';
import Sport3DIcon from '../components/Sport3DIcon';

const HomePage = () => {
  const [sports, setSports] = useState([
    { id: 1, name: 'Football', icon: '⚽', color: '#00d4ff' },
    { id: 2, name: 'Basketball', icon: '🏀', color: '#b829ff' },
    { id: 3, name: 'Tennis', icon: '🎾', color: '#ff29d4' },
    { id: 4, name: 'Cricket', icon: '🏏', color: '#00ff88' },
    { id: 5, name: 'Badminton', icon: '🏸', color: '#ffaa00' },
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Motion Loop Background */}
      <MotionBackground />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section - Minimal */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* AI Greeting with Smooth Animation */}
            <AIGreeting />

            {/* CTA Button with Glow Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <Link to="/sports">
                <button className="glass glow-effect px-12 py-4 text-xl font-bold text-white hover:scale-105 transform transition-all duration-300">
                  Explore Sports
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Sports Grid Section */}
        <section className="py-20 px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-glow-blue via-glow-purple to-glow-pink bg-clip-text text-transparent"
          >
            Choose Your Game
          </motion.h2>

          {/* Card-based Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {sports.map((sport, index) => (
              <SportCard 
                key={sport.id} 
                sport={sport} 
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Glassmorphic Booking Panel */}
        <section className="py-20 px-4">
          <GlassBookingPanel />
        </section>

        {/* 3D Floating Icons Section */}
        <section className="py-20 px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16 text-white"
          >
            Interactive Sport Experience
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {sports.map((sport) => (
              <Sport3DIcon key={sport.id} sport={sport} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="glass py-8 mt-20 mx-4 mb-4">
          <p className="text-center text-gray-400">
            © 2025 Sporty - Your Ultimate Sports Booking Platform
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
