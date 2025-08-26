#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server without GraphQL codegen
echo "Starting development server in local mode (without GraphQL codegen)..."
# Open browser and start server
(sleep 5 && open "http://www.localtest.me:3010/") &
npm run server:local 