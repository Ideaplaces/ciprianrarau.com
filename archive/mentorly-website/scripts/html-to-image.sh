#!/bin/bash

# HTML to Image Converter Script
# Usage: ./html-to-image.sh [input.html] [output.png] [options...]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_SCRIPT="$SCRIPT_DIR/html-to-image.js"

# Check if Node.js script exists
if [ ! -f "$NODE_SCRIPT" ]; then
    echo "❌ Error: html-to-image.js not found at $NODE_SCRIPT"
    exit 1
fi

# Check if we're in the mentorly-website directory or need to change to it
if [ ! -f "package.json" ] || ! grep -q "mentorly-website" package.json 2>/dev/null; then
    # Try to find mentorly-website directory
    if [ -d "mentorly-website" ]; then
        cd mentorly-website
    elif [ -d "../mentorly-website" ]; then
        cd ../mentorly-website
    else
        echo "❌ Error: Could not find mentorly-website directory"
        exit 1
    fi
fi

# Run the Node.js script with all arguments passed through
node "$NODE_SCRIPT" "$@" 