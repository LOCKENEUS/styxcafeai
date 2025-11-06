import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SportCard from '../components/SportCard';
import MotionBackground from '../components/MotionBackground';

const SportsPage = () => {
  const sports = [
    { id: 1, name: 'Football', icon: '⚽', color: '#00d4ff', description: 'The beautiful game that brings people together' },
    { id: 2, name: 'Basketball', icon: '🏀', color: '#b829ff', description: 'Fast-paced action and incredible teamwork' },
    { id: 3, name: 'Tennis', icon: '🎾', color: '#ff29d4', description: 'Precision, power, and strategic gameplay' },
    { id: 4, name: 'Cricket', icon: '🏏', color: '#00ff88', description: 'The gentleman\'s game with endless excitement' },
    { id: 5, name: 'Badminton', icon: '🏸', color: '#ffaa00', description: 'Quick reflexes and intense rallies' },
  ];

  return (
    <div className="relative min-h-screen">
      <MotionBackground />

      <div className="relative z-10 py-20 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Link to="/" className="text-glow-blue hover:text-glow-purple transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-6xl font-bold mt-8 mb-4 bg-gradient-to-r from-glow-blue via-glow-purple to-glow-pink bg-clip-text text-transparent">
            All Sports
          </h1>
          <p className="text-xl text-gray-300">
            Choose your favorite sport and book a court now
          </p>
        </motion.div>

        {/* Sports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sports.map((sport, index) => (
            <div key={sport.id}>
              <SportCard sport={sport} index={index} />
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-center text-gray-400 mt-4 px-4"
              >
                {sport.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsPage;
