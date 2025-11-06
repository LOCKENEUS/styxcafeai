import { motion } from 'framer-motion';
import { useState } from 'react';

const GlassBookingPanel = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const sports = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Badminton'];
  const timeSlots = ['06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

  const handleQuickBook = () => {
    if (selectedSport && selectedDate && selectedTime) {
      alert(`Booking ${selectedSport} on ${selectedDate} at ${selectedTime}`);
    } else {
      alert('Please select all fields');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto"
    >
      {/* Glass Panel */}
      <div className="glass glow-effect p-8 md:p-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-glow-blue to-glow-purple bg-clip-text text-transparent"
        >
          Quick Booking
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sport Selection */}
          <div>
            <label className="block text-white mb-2 text-sm font-semibold">Select Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full glass px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-glow-blue"
            >
              <option value="" className="bg-gray-900">Choose a sport</option>
              {sports.map((sport) => (
                <option key={sport} value={sport} className="bg-gray-900">
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-white mb-2 text-sm font-semibold">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full glass px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-glow-purple"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-white mb-2 text-sm font-semibold">Select Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full glass px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-glow-pink"
            >
              <option value="" className="bg-gray-900">Choose a time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time} className="bg-gray-900">
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Now Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleQuickBook}
          className="w-full mt-8 glass glow-effect py-4 text-xl font-bold text-white hover:bg-white/10 transition-all duration-300"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GlassBookingPanel;
