#!/bin/bash
# Script to keep Node.js backend running

while true; do
    # Check if Node.js backend is running
    if ! pgrep -f "node index.js" > /dev/null; then
        echo "$(date): Node.js backend not running. Starting..."
        
        # Kill any process on port 8001
        lsof -ti:8001 | xargs kill -9 2>/dev/null
        
        # Start Node.js backend
        cd /app/backend
        nohup node index.js > /var/log/supervisor/backend.out.log 2> /var/log/supervisor/backend.err.log &
        
        sleep 3
        echo "$(date): Node.js backend started"
    fi
    
    sleep 10
done
