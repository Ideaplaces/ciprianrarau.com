#!/usr/bin/env python3
"""
Simple Section Extractor for Websites
Extracts 4-5 meaningful sections from website screenshots
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Tuple
from PIL import Image, ImageDraw, ImageStat


class SimpleSectionExtractor:
    """Extract typical website sections from screenshots"""
    
    def extract_sections(self, image_path: str, output_dir: str) -> Dict:
        """Extract standard website sections"""
        img = Image.open(image_path).convert('RGB')
        width, height = img.size
        
        print(f"Processing {width}x{height}px image")
        
        # Create output directory
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Define typical website sections based on common patterns
        sections = []
        
        # 1. Header - Top 10% or 200px, whichever is smaller
        header_height = min(int(height * 0.1), 200)
        if header_height > 50:
            sections.append({
                'type': 'header',
                'bounds': (0, 0, width, header_height),
                'description': 'Navigation and branding'
            })
        
        # 2. Hero Section - Next 20-30% of page
        hero_start = header_height
        hero_height = min(int(height * 0.25), 600)
        if hero_start + hero_height < height:
            sections.append({
                'type': 'hero',
                'bounds': (0, hero_start, width, hero_start + hero_height),
                'description': 'Main banner or hero section'
            })
        
        # 3. Main Content - Middle section
        content_start = hero_start + hero_height
        footer_height = min(int(height * 0.15), 400)
        content_end = height - footer_height
        
        if content_end > content_start + 200:
            # Split content into 1-2 sections if it's very tall
            content_height = content_end - content_start
            
            if content_height > 1000:
                # Two content sections
                mid_point = content_start + content_height // 2
                
                sections.append({
                    'type': 'features',
                    'bounds': (0, content_start, width, mid_point),
                    'description': 'Features or services section'
                })
                
                sections.append({
                    'type': 'content',
                    'bounds': (0, mid_point, width, content_end),
                    'description': 'Additional content section'
                })
            else:
                # Single content section
                sections.append({
                    'type': 'main_content',
                    'bounds': (0, content_start, width, content_end),
                    'description': 'Main content area'
                })
        
        # 4. Footer - Bottom 15% or 400px, whichever is smaller
        if footer_height > 50:
            sections.append({
                'type': 'footer',
                'bounds': (0, height - footer_height, width, height),
                'description': 'Footer with links and information'
            })
        
        # Analyze and adjust sections based on visual content
        adjusted_sections = self._adjust_sections_by_content(img, sections)
        
        # Save sections
        saved_sections = []
        for i, section in enumerate(adjusted_sections):
            x, y, w, h = section['bounds']
            
            # Skip very small sections
            if h < 50:
                continue
            
            # Extract section
            section_img = img.crop((x, y, x + w, y + h))
            
            # Generate filename
            filename = f"{section['type']}_{i+1:02d}.png"
            filepath = os.path.join(output_dir, filename)
            
            # Save section
            section_img.save(filepath)
            
            saved_sections.append({
                'type': section['type'],
                'filename': filename,
                'bounds': [x, y, w, h],
                'description': section['description']
            })
            
            print(f"  Saved {section['type']}: {w}x{h}px")
        
        # Create preview
        self._create_preview(img, saved_sections, output_dir)
        
        # Save metadata
        metadata = {
            'source_image': os.path.basename(image_path),
            'dimensions': {'width': width, 'height': height},
            'sections_count': len(saved_sections),
            'sections': saved_sections
        }
        
        with open(os.path.join(output_dir, 'metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"  Total sections extracted: {len(saved_sections)}")
        
        return metadata
    
    def _adjust_sections_by_content(self, img: Image.Image, sections: List[Dict]) -> List[Dict]:
        """Adjust section boundaries based on visual content"""
        adjusted = []
        
        for section in sections:
            x, y, w, h = section['bounds']
            
            # Try to find better boundaries by looking for visual breaks
            new_y = y
            new_h = h
            
            # Look for white space or color changes at boundaries
            if section['type'] != 'header' and y > 0:
                # Check area above for better start point
                search_start = max(0, y - 100)
                best_y = self._find_content_boundary(img, search_start, y + 50, 'start')
                if best_y:
                    new_y = best_y
                    new_h = h + (y - new_y)
            
            if section['type'] != 'footer' and y + h < img.height:
                # Check area below for better end point
                search_end = min(img.height, y + h + 100)
                best_end = self._find_content_boundary(img, y + h - 50, search_end, 'end')
                if best_end:
                    new_h = best_end - new_y
            
            adjusted.append({
                'type': section['type'],
                'bounds': (x, new_y, w, new_h),
                'description': section['description']
            })
        
        return adjusted
    
    def _find_content_boundary(self, img: Image.Image, start_y: int, end_y: int, 
                                boundary_type: str) -> int:
        """Find visual boundary in a range"""
        best_y = None
        max_diff = 0
        
        for y in range(start_y, end_y - 10, 5):
            # Compare two horizontal strips
            strip1 = img.crop((0, y, img.width, y + 5))
            strip2 = img.crop((0, y + 5, img.width, y + 10))
            
            # Get average colors
            stat1 = ImageStat.Stat(strip1)
            stat2 = ImageStat.Stat(strip2)
            
            # Calculate color difference
            diff = sum(abs(a - b) for a, b in zip(stat1.mean, stat2.mean))
            
            # Look for maximum difference (visual boundary)
            if diff > max_diff:
                max_diff = diff
                best_y = y + 5
        
        # Only return if significant difference found
        if max_diff > 30:
            return best_y
        
        return None
    
    def _create_preview(self, img: Image.Image, sections: List[Dict], output_dir: str):
        """Create a preview showing section boundaries"""
        # Scale down if image is very tall
        width, height = img.size
        max_preview_height = 2000
        
        if height > max_preview_height:
            scale = max_preview_height / height
            preview_size = (int(width * scale), int(height * scale))
            preview = img.resize(preview_size, Image.Resampling.LANCZOS)
        else:
            scale = 1.0
            preview = img.copy()
        
        draw = ImageDraw.Draw(preview)
        
        # Colors for different section types
        colors = {
            'header': '#FF0000',
            'hero': '#00AA00',
            'features': '#0066CC',
            'main_content': '#6600CC',
            'content': '#CC6600',
            'footer': '#666666'
        }
        
        # Draw section boundaries
        for section in sections:
            x, y, w, h = section['bounds']
            
            # Scale coordinates if needed
            if scale < 1.0:
                x = int(x * scale)
                y = int(y * scale)
                w = int(w * scale)
                h = int(h * scale)
            
            color = colors.get(section['type'], '#000000')
            
            # Draw rectangle
            draw.rectangle([x, y, x + w - 1, y + h - 1], outline=color, width=3)
            
            # Add label with background
            label = section['type'].upper()
            bbox = draw.textbbox((x + 10, y + 10), label)
            draw.rectangle([bbox[0]-5, bbox[1]-2, bbox[2]+5, bbox[3]+2], fill='white')
            draw.text((x + 10, y + 10), label, fill=color)
        
        preview.save(os.path.join(output_dir, 'preview.png'))


def process_wehappers_screenshot():
    """Process the wehappers.org screenshot specifically"""
    # Look for wehappers screenshot
    screenshots_dir = Path('.')
    wehappers_files = [f for f in screenshots_dir.glob('*wehapper*.*') 
                       if f.suffix.lower() in ['.png', '.jpg', '.jpeg']]
    
    if not wehappers_files:
        print("No wehappers screenshot found. Looking for any screenshot...")
        # Try to find any screenshot that might be wehappers
        all_screenshots = [f for f in screenshots_dir.glob('*.png')]
        if all_screenshots:
            print(f"Found {len(all_screenshots)} screenshots. Processing all...")
            extractor = SimpleSectionExtractor()
            
            for screenshot in all_screenshots:
                output_dir = f"smart_sections/{screenshot.stem}"
                print(f"\nProcessing: {screenshot.name}")
                extractor.extract_sections(str(screenshot), output_dir)
        else:
            print("No screenshots found!")
    else:
        extractor = SimpleSectionExtractor()
        for wehappers_file in wehappers_files:
            print(f"Processing wehappers screenshot: {wehappers_file}")
            output_dir = "smart_sections/wehappers"
            extractor.extract_sections(str(wehappers_file), output_dir)


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 2:
        # Command line usage
        input_file = sys.argv[1]
        output_dir = sys.argv[2]
        
        extractor = SimpleSectionExtractor()
        extractor.extract_sections(input_file, output_dir)
    else:
        # Process wehappers or all screenshots
        process_wehappers_screenshot()