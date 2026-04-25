# Screenshot Processing Scripts - Guidelines

## Script Management Policy

**IMPORTANT**: To maintain code organization and prevent script proliferation, follow these guidelines:

1. **Avoid creating multiple parallel scripts** - Instead of creating new scripts for similar functionality, modify or extend existing ones.

2. **Keep all screenshot-related scripts in this folder** - Do not scatter screenshot processing scripts across different directories.

3. **Single responsibility** - Have one main script that handles screenshot segmentation with different modes/options rather than multiple scripts.

## Current Screenshot Processing

The screenshot segmentation functionality should be contained in a single, well-structured script that:
- Detects components in website screenshots
- Segments them into individual files
- Organizes output by website name
- Generates metadata for each component

## Usage

```bash
python3 segment_screenshots.py <input_dir> <output_dir> [options]
```

## Directory Structure

```
screenshots/
├── CLAUDE.md              # This file
├── segment_screenshots.py # Main segmentation script
├── requirements.txt       # Python dependencies
├── segmented/            # Output directory
│   └── [website_name]/   # Per-website folders
│       ├── *.png         # Component images
│       └── metadata.json # Component information
└── *.png                 # Source screenshots
```

## Development Guidelines

When modifying the screenshot processing:
1. Work within the existing script structure
2. Add new features as functions or classes, not new files
3. Use command-line arguments for different modes
4. Keep dependencies minimal
5. Document changes in the script itself