#!/bin/bash

echo "🌊 Ocean Loop - System Check"
echo "============================"
echo ""

# Check files
echo "📁 Checking files..."
FILES=("index.html" "test.html" "sketch.js" "Loop.js" "interactions.js" "serve.py")
ALL_FOUND=true

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING!"
        ALL_FOUND=false
    fi
done
echo ""

# Check Python
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ $PYTHON_VERSION"
else
    echo "❌ Python 3 not found!"
fi
echo ""

# Check ports
echo "🔌 Checking ports..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8080 is already in use"
    echo "   Run: pkill -f http.server"
else
    echo "✅ Port 8080 is available"
fi
echo ""

# Summary
echo "📊 Summary"
echo "=========="
if [ "$ALL_FOUND" = true ]; then
    echo "✅ All files present"
    echo "✅ Ready to run!"
    echo ""
    echo "Next steps:"
    echo "  1. ./start.sh"
    echo "  2. Open http://localhost:8080/test.html"
else
    echo "❌ Some files are missing"
    echo "   Please check the installation"
fi
