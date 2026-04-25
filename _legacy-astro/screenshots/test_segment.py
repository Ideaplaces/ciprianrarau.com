#!/usr/bin/env python3
"""Quick test of segmentation on one image"""

from segment_screenshots import ScreenshotSegmenter
import sys

if __name__ == "__main__":
    segmenter = ScreenshotSegmenter(mode='basic')
    
    # Test on one image
    test_image = "My Day in Music Screenshot Jun 29 2025.png"
    output_dir = "segmented/test"
    
    print(f"Testing segmentation on: {test_image}")
    result = segmenter.process_screenshot(test_image, output_dir)
    
    print(f"\nResult: {result}")