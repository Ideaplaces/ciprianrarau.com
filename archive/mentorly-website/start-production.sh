#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

echo "Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "Production build complete! Starting production server on port 3010..."
    # Open browser and start production server
    (sleep 5 && open "http://localhost:3010/") &
    npx next start -p 3010
else
    echo "Build failed. Please check the errors above."
    exit 1
fi 