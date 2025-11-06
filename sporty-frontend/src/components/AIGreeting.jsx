import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AIGreeting = () => {
  const [greeting, setGreeting] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGreeting();
  }, []);

  const fetchGreeting = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      
      // Get current time context
      const hour = new Date().getHours();
      let time_of_day = 'morning';
      if (hour >= 12 && hour < 17) time_of_day = 'afternoon';
      else if (hour >= 17) time_of_day = 'evening';

      const response = await axios.post(`${API_URL}/api/ai/generate-greeting`, {
        time_of_day
      });

      if (response.data.success) {
        setGreeting(response.data.greeting);
      } else {
        setGreeting('Hey Player, ready to dominate the court today?');
      }
    } catch (error) {
      console.error('Error fetching greeting:', error);
      setGreeting('Hey Player, ready to dominate the court today?');
    } finally {
      setIsLoading(false);
    }
  };

  // Split greeting into words for animated text effect
  const words = greeting.split(' ');

  return (
    <div className="text-center">
      <motion.div
        className="text-6xl md:text-8xl font-bold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {!isLoading ? (
          <div className="flex flex-wrap justify-center gap-x-4">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
                className="inline-block bg-gradient-to-r from-glow-blue via-glow-purple to-glow-pink bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white"
          >
            Loading...
          </motion.div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
      >
        Book your favorite courts instantly. Play anytime, anywhere.
      </motion.p>
    </div>
  );
};

export default AIGreeting;
