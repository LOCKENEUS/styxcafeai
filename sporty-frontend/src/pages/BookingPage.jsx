import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import MotionBackground from '../components/MotionBackground';

const BookingPage = () => {
  const { sportId } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');

  const sportsData = {
    1: { name: 'Football', icon: '⚽', color: '#00d4ff' },
    2: { name: 'Basketball', icon: '🏀', color: '#b829ff' },
    3: { name: 'Tennis', icon: '🎾', color: '#ff29d4' },
    4: { name: 'Cricket', icon: '🏏', color: '#00ff88' },
    5: { name: 'Badminton', icon: '🏸', color: '#ffaa00' },
  };

  const sport = sportsData[sportId];

  const venues = [
    { id: 1, name: 'Downtown Sports Complex', price: '$50/hr' },
    { id: 2, name: 'City Arena', price: '$60/hr' },
    { id: 3, name: 'Elite Sports Club', price: '$75/hr' },
  ];

  const timeSlots = [
    '06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM',
    '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'
  ];

  const handleBooking = () => {
    if (selectedVenue && selectedDate && selectedTime) {
      alert(`Booking confirmed!\nSport: ${sport.name}\nVenue: ${venues.find(v => v.id == selectedVenue)?.name}\nDate: ${selectedDate}\nTime: ${selectedTime}`);
    } else {
      alert('Please complete all fields');
    }
  };

  if (!sport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">Sport not found</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <MotionBackground />

      <div className="relative z-10 py-20 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link to="/sports" className="text-glow-blue hover:text-glow-purple transition-colors">
            ← Back to Sports
          </Link>
          <div className="text-8xl mt-8">{sport.icon}</div>
          <h1 className="text-5xl font-bold mt-4" style={{ color: sport.color }}>
            Book {sport.name}
          </h1>
        </motion.div>

        {/* Booking Form in Glass Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass glow-effect p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Reserve Your Spot
            </h2>

            {/* Venue Selection */}
            <div className="mb-6">
              <label className="block text-white mb-3 text-lg font-semibold">
                Select Venue
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {venues.map((venue) => (
                  <motion.div
                    key={venue.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVenue(venue.id)}
                    className={`glass p-4 cursor-pointer transition-all ${
                      selectedVenue === venue.id
                        ? 'ring-2 ring-glow-blue bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <h3 className="text-white font-semibold">{venue.name}</h3>
                    <p className="text-glow-blue mt-1">{venue.price}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-white mb-3 text-lg font-semibold">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full glass px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-glow-purple"
              />
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <label className="block text-white mb-3 text-lg font-semibold">
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(time)}
                    className={`glass py-3 px-4 text-white transition-all ${
                      selectedTime === time
                        ? 'ring-2 ring-glow-pink bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBooking}
              className="w-full glass glow-effect py-4 text-xl font-bold text-white hover:bg-white/10 transition-all"
              style={{
                boxShadow: `0 0 20px ${sport.color}40`
              }}
            >
              Confirm Booking
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;
