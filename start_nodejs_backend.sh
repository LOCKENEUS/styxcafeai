#!/bin/bash
# Startup script to run Node.js backend
# This script is called by supervisor and ensures Node.js backend runs

cd /app/backend
export PORT=8001
exec node index.js
