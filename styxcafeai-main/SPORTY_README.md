# Sporty - Modern Sports Booking Platform

## Overview
Sporty is a cutting-edge sports facility booking platform with a modern, immersive UI/UX experience. Built with React, Node.js, and AI-powered features.

## Key Features

### 🎨 Modern UI/UX
- **Minimal Hero Section**: Clean, uncluttered main banner with focus on content
- **Motion Loop Backgrounds**: Dynamic sports scenes with smooth fade transitions
- **Card-based Grid Layouts**: Organized content with gradient-bordered cards
- **Glassmorphic Booking Panels**: Transparent, frosted-glass design elements
- **3D Floating Icons**: Interactive React Three Fiber sport icons
- **Dark + Bright Gradient Glow Palette**: Vibrant color scheme with neon accents
- **Smooth AI Text Animations**: Word-by-word animated greetings

### 🤖 AI Integration
- **Claude Sonnet 4 Powered**: Dynamic greeting generation based on time of day
- **Contextual Messages**: Personalized user experience
- **Sport Descriptions**: AI-generated exciting sport descriptions

### 🏆 Core Functionality
- **Multi-Sport Support**: Football, Basketball, Tennis, Cricket, Badminton (more can be added via admin)
- **Quick Booking**: Fast, intuitive booking flow
- **Venue Selection**: Multiple venues with pricing
- **Time Slot Management**: Flexible booking times
- **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- **React 18** with Vite
- **Framer Motion** for animations
- **React Three Fiber** for 3D graphics
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Python** for AI integration
- **MongoDB** for database
- **emergentintegrations** for Claude AI
- **CORS** enabled for cross-origin requests

## Architecture

```
/app/
├── sporty-frontend/          # React frontend (Port 3002)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── AIGreeting.jsx
│   │   │   ├── MotionBackground.jsx
│   │   │   ├── SportCard.jsx
│   │   │   ├── GlassBookingPanel.jsx
│   │   │   └── Sport3DIcon.jsx
│   │   ├── pages/            # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── SportsPage.jsx
│   │   │   └── BookingPage.jsx
│   │   └── App.jsx
│   └── .env                  # Frontend config
│
├── styx-backend/             # Node.js backend (Port 8001)
│   ├── component/
│   │   └── ai/
│   │       └── router.js     # AI API endpoints
│   ├── ai_text_generator.py  # Claude AI integration
│   ├── ai_greeting_api.py    # Greeting generation
│   └── ai_sport_description_api.py
│
└── styx-admin-panel/         # Admin interface (Port 3001)
    └── (existing Styx admin)
```

## API Endpoints

### AI Endpoints
- **POST** `/api/ai/generate-greeting`
  - Body: `{ time_of_day: "morning|afternoon|evening", name?: string, preferred_sport?: string }`
  - Returns: AI-generated personalized greeting

- **POST** `/api/ai/generate-sport-description`
  - Body: `{ sport_name: string }`
  - Returns: AI-generated sport description

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8001
PORT=3002
```

### Backend (.env)
```
PORT=8001
DB_URL=mongodb://localhost:27017/styxcafe
EMERGENT_LLM_KEY=sk-emergent-b0e57B024C2F6A94a1
SECRET_KEY=...
JWT_EXPIRY=7d
```

## Running the Application

### Start All Services
```bash
sudo supervisorctl restart all
```

### Check Status
```bash
sudo supervisorctl status
```

### View Logs
```bash
# Frontend logs
tail -f /var/log/supervisor/sporty-frontend.out.log

# Backend logs
tail -f /var/log/supervisor/backend.out.log
```

## URLs

- **Sporty Frontend**: http://localhost:3002
- **Admin Panel**: http://localhost:3001
- **Styx Website**: http://localhost:3000
- **Backend API**: http://localhost:8001

## Key UI Components

### 1. AIGreeting Component
- Fetches AI-generated greeting from backend
- Word-by-word animation effect
- Time-based context (morning/afternoon/evening)

### 2. MotionBackground Component
- Cycling sports scenes (3 variations)
- Floating sport icons with physics-based animation
- Smooth gradient transitions

### 3. SportCard Component
- Glassmorphic card design
- Hover effects with 3D rotation
- Custom gradient borders per sport
- Decorative corner accents

### 4. GlassBookingPanel Component
- Quick booking interface
- Sport, date, and time selection
- Glassmorphic design with glow effects

### 5. Sport3DIcon Component
- Interactive 3D sphere using Three.js
- Floating animation
- Hover scale effect
- Sport-specific colors

## Color Palette

```css
--glow-blue: #00d4ff
--glow-purple: #b829ff
--glow-pink: #ff29d4
--glow-green: #00ff88
--glow-orange: #ffaa00
--background: #0a0a0a
```

## AI Integration Details

### Claude Sonnet 4
- Model: `claude-3-7-sonnet-20250219`
- Provider: Anthropic
- Integration: emergentintegrations library
- Key: Emergent LLM universal key

### Use Cases
1. Dynamic hero greetings
2. Contextual user messages
3. Sport descriptions
4. Future: Booking suggestions, personalized recommendations

## Future Enhancements
- User authentication
- Payment integration
- Real-time availability
- Booking history
- User profiles
- More sports via admin panel
- Mobile app
- Push notifications

## Development

### Hot Reload
Both frontend and backend support hot reload. Changes are reflected automatically.

### Adding New Sports
Sports can be added through the super admin panel (existing Styx functionality).

### Customizing AI Messages
Edit `/app/styx-backend/ai_text_generator.py` to customize system messages and prompts.

## Troubleshooting

### AI Greeting Not Loading
1. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
2. Verify EMERGENT_LLM_KEY in backend .env
3. Test endpoint: `curl -X POST http://localhost:8001/api/ai/generate-greeting -H "Content-Type: application/json" -d '{"time_of_day":"morning"}'`

### 3D Icons Not Rendering
- Ensure WebGL is supported in browser
- Check console for Three.js errors
- Verify @react-three/fiber installation

### Frontend Not Loading
1. Check port 3002 availability
2. Verify yarn install completed
3. Check frontend logs: `tail -f /var/log/supervisor/sporty-frontend.out.log`

## License
MIT

## Credits
Built with ❤️ using modern web technologies and AI
