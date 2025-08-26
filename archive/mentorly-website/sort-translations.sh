#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Print header
echo "====================================="
echo "TRANSLATION FILES SORTING UTILITY"
echo "====================================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Run the sort translations script
echo "Starting translation files sorting..."
node sort-translations.js

# Output completion message
if [ $? -eq 0 ]; then
    echo "====================================="
    echo "✓ SORTING COMPLETED SUCCESSFULLY"
    echo "====================================="
else
    echo "====================================="
    echo "× SORTING FAILED - CHECK ERRORS ABOVE"
    echo "====================================="
    exit 1
fi

exit 0 