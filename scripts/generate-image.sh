#!/bin/bash
# Generate images using Google's Gemini Image API (Nano Banana Pro)
# Usage: ./scripts/generate-image.sh "prompt" output.png
#
# Examples:
#   ./scripts/generate-image.sh "A minimalist tech icon" icon.png
#   ./scripts/generate-image.sh "Blog header for DevOps article" header.png --model gemini-2.0-flash-exp-image-generation
#
# Models available:
#   - gemini-3-pro-image-preview (default, best quality - Nano Banana Pro)
#   - gemini-2.5-flash-image (higher quality)
#   - gemini-2.0-flash-exp-image-generation (fast iterations)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
IMAGE_GEN_DIR="/home/chipdev/google-image-gen"

# Check if google-image-gen exists
if [ ! -d "$IMAGE_GEN_DIR" ]; then
    echo "Error: google-image-gen not found at $IMAGE_GEN_DIR"
    exit 1
fi

# Check arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 \"prompt\" output.png [--model MODEL]"
    echo ""
    echo "Models:"
    echo "  gemini-3-pro-image-preview       - Best quality (default)"
    echo "  gemini-2.5-flash-image           - Higher quality"
    echo "  gemini-2.0-flash-exp-image-generation - Fast iterations"
    echo ""
    echo "Examples:"
    echo "  $0 \"A minimalist CR logo\" public/images/logo.png"
    echo "  $0 \"DevOps architecture diagram\" public/images/devops.png --model gemini-2.0-flash-exp-image-generation"
    exit 1
fi

PROMPT="$1"
OUTPUT="$2"
MODEL="gemini-3-pro-image-preview"

# Parse optional model argument
if [ "$3" == "--model" ] && [ -n "$4" ]; then
    MODEL="$4"
fi

# Make output path absolute if relative
if [[ ! "$OUTPUT" = /* ]]; then
    OUTPUT="$PROJECT_ROOT/$OUTPUT"
fi

echo "🎨 Generating image..."
echo "   Prompt: $PROMPT"
echo "   Output: $OUTPUT"
echo "   Model: $MODEL"
echo ""

cd "$IMAGE_GEN_DIR"
python3 generate.py "$PROMPT" "$OUTPUT" --model "$MODEL"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Image generated successfully!"
    echo "   File: $OUTPUT"
    echo "   Size: $(du -h "$OUTPUT" | cut -f1)"
else
    echo ""
    echo "❌ Image generation failed"
    exit 1
fi
