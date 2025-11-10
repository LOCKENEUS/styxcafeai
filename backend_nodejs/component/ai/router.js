const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Generate AI greeting
router.post('/generate-greeting', async (req, res) => {
  try {
    const { name, preferred_sport, time_of_day } = req.body;
    
    // Prepare context for Python script
    const context = JSON.stringify({
      name: name || null,
      preferred_sport: preferred_sport || null,
      time_of_day: time_of_day || null
    });
    
    // Path to Python script
    const pythonScript = path.join(__dirname, '..', '..', 'ai_greeting_api.py');
    
    // Spawn Python process with virtual environment
    const pythonPath = process.env.PYTHON_PATH || '/root/.venv/bin/python';
    const python = spawn(pythonPath, [pythonScript, context]);
    
    let dataString = '';
    let errorString = '';
    
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorString);
        return res.status(500).json({
          success: false,
          message: 'Failed to generate greeting',
          greeting: 'Hey Player, ready to dominate the court today?'
        });
      }
      
      try {
        const result = JSON.parse(dataString);
        res.json({
          success: true,
          greeting: result.greeting
        });
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError);
        res.status(500).json({
          success: false,
          message: 'Failed to parse AI response',
          greeting: 'Hey Player, ready to dominate the court today?'
        });
      }
    });
  } catch (error) {
    console.error('Error in AI greeting endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      greeting: 'Hey Player, ready to dominate the court today?'
    });
  }
});

// Generate sport description
router.post('/generate-sport-description', async (req, res) => {
  try {
    const { sport_name } = req.body;
    
    if (!sport_name) {
      return res.status(400).json({
        success: false,
        message: 'Sport name is required'
      });
    }
    
    // Path to Python script
    const pythonScript = path.join(__dirname, '..', '..', 'ai_sport_description_api.py');
    
    // Spawn Python process with virtual environment
    const pythonPath = process.env.PYTHON_PATH || '/root/.venv/bin/python';
    const python = spawn(pythonPath, [pythonScript, sport_name]);
    
    let dataString = '';
    let errorString = '';
    
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorString);
        return res.status(500).json({
          success: false,
          message: 'Failed to generate sport description',
          description: `Experience the thrill of ${sport_name}! Book your slot now.`
        });
      }
      
      try {
        const result = JSON.parse(dataString);
        res.json({
          success: true,
          description: result.description
        });
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError);
        res.status(500).json({
          success: false,
          message: 'Failed to parse AI response',
          description: `Experience the thrill of ${sport_name}! Book your slot now.`
        });
      }
    });
  } catch (error) {
    console.error('Error in AI sport description endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      description: `Experience the thrill of ${req.body.sport_name || 'this sport'}! Book your slot now.`
    });
  }
});

module.exports = router;
