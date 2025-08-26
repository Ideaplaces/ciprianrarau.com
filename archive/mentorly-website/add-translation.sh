#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Print header
echo "====================================="
echo "TRANSLATION ADDING UTILITY"
echo "====================================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Check for arguments and pass them to the Node.js script
if [ $# -lt 2 ]; then
    node add-translation.js
    exit 1
fi

# Run the add translation script with all arguments
echo "Starting translation addition process..."
node add-translation.js "$@"

# Get exit code
EXIT_CODE=$?

# Output completion message
if [ $EXIT_CODE -eq 0 ]; then
    echo "====================================="
    echo "✓ TRANSLATION ADDED SUCCESSFULLY"
    echo "====================================="
    echo "You can now use the translation key in your code:"
    echo "formatMessage({ id: '$1' })"
    echo "====================================="
else
    echo "====================================="
    echo "× TRANSLATION ADDITION FAILED - CHECK ERRORS ABOVE"
    echo "====================================="
    exit 1
fi

exit 0 