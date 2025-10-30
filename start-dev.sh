#!/bin/bash
# Script to start dev server on port 3000

echo "Checking port 3000..."

if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use!"
    echo "Please manually kill the process from Activity Monitor:"
    echo "1. Open Activity Monitor (Cmd+Space, type 'Activity Monitor')"
    echo "2. Search for process 57580 or 'next-server'"
    echo "3. Force Quit it"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Port 3000 is free! Starting dev server..."
cd /Users/yasiinali/careercompassi
npm run dev


