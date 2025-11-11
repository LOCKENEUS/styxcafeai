#!/bin/bash
# Keep Node.js backend running

while true; do
    # Check if node backend is running
    if ! pgrep -f "node index.js" > /dev/null; then
        echo "Starting Node.js backend..."
        cd /app/backend
        nohup node index.js > /var/log/supervisor/backend.out.log 2> /var/log/supervisor/backend.err.log &
        sleep 5
    fi
    sleep 10
done
