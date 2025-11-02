#!/bin/bash
# Railway startup script

echo "🚀 Starting E-commerce Backend..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the server
echo "🌐 Starting Node.js server..."
npm start
