import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SportCard = ({ sport, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="relative group"
    >
      <Link to={`/booking/${sport.id}`}>
        <div
          className="glass p-8 h-64 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
          style={{
            borderImage: `linear-gradient(135deg, ${sport.color}40, transparent) 1`,
            borderWidth: '2px',
            borderStyle: 'solid',
          }}
        >
          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${sport.color}, transparent 70%)`
            }}
          />

          {/* Sport Icon */}
          <motion.div
            className="text-8xl mb-4 relative z-10"
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
          >
            {sport.icon}
          </motion.div>

          {/* Sport Name */}
          <h3 className="text-3xl font-bold text-white relative z-10">
            {sport.name}
          </h3>

          {/* Decorative Corner Accents */}
          <div 
            className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 opacity-50"
            style={{ borderColor: sport.color }}
          />
          <div 
            className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 opacity-50"
            style={{ borderColor: sport.color }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default SportCard;
