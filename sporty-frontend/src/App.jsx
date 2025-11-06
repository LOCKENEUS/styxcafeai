import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SportsPage from './pages/SportsPage';
import BookingPage from './pages/BookingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-[#0a0a0a]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/booking/:sportId" element={<BookingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
