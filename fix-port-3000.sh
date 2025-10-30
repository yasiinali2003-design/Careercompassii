#!/bin/bash
# Script to forcefully free port 3000

echo "Attempting to free port 3000..."

# Kill all processes
lsof -ti:3000 | xargs kill -9 2>/dev/null
pkill -9 -f "next" 2>/dev/null
pkill -9 node 2>/dev/null

# Wait a moment
sleep 2

# Check if port is free
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is still in use by a stuck process."
    echo "Please manually kill process 57580 from Activity Monitor:"
    echo "1. Open Activity Monitor (Cmd+Space, type 'Activity Monitor')"
    echo "2. Search for '57580' or 'next-server'"
    echo "3. Force Quit it"
    echo ""
    echo "Or restart your Mac to clear all stuck processes."
    exit 1
else
    echo "✅ Port 3000 is now free!"
    exit 0
fi


