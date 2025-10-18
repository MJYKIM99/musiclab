#!/bin/bash

echo "🌊 Ocean Loop Project"
echo "===================="
echo ""

# Kill any existing servers on common ports
echo "Cleaning up old servers..."
pkill -f "http.server" 2>/dev/null
pkill -f "SimpleHTTP" 2>/dev/null

# Try to use the custom Python server
if command -v python3 &> /dev/null; then
    echo "Starting server with Python 3..."
    echo ""
    python3 serve.py
elif command -v python &> /dev/null; then
    echo "Starting server with Python 2..."
    echo ""
    python -m SimpleHTTPServer 8080
else
    echo "❌ Error: Python not found!"
    echo ""
    echo "Please install Python or use one of these alternatives:"
    echo "  - npm: npx http-server -p 8080"
    echo "  - PHP: php -S localhost:8080"
    echo ""
    exit 1
fi
