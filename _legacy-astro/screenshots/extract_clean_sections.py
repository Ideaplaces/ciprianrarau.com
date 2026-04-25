#!/usr/bin/env python3
"""
Clean Section Extractor
Extracts 4-5 non-overlapping, meaningful sections from website screenshots
"""

import os
import json
from pathlib import Path
from typing import List, Dict
from PIL import Image, ImageDraw, ImageStat


class CleanSectionExtractor:
    """Extract clean, non-overlapping website sections"""
    
    def extract_sections(self, image_path: str, output_dir: str, max_sections: int = 5) -> Dict:
        """Extract up to max_sections non-overlapping sections"""
        img = Image.open(image_path).convert('RGB')
        width, height = img.size
        
        print(f"Processing {width}x{height}px image")
        
        # Create output directory
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Find optimal section boundaries
        sections = self._find_optimal_sections(img, max_sections)
        
        # Save sections
        saved_sections = []
        for i, section in enumerate(sections):
            x, y, w, h = section['bounds']
            
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
                'position': i + 1,
                'of_total': len(sections)
            })
            
            print(f"  {section['type']}: {h}px tall ({int(h/height*100)}% of page)")
        
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
        
        return metadata
    
    def _find_optimal_sections(self, img: Image.Image, max_sections: int) -> List[Dict]:
        """Find optimal non-overlapping sections"""
        width, height = img.size
        
        # For very tall images, we need to be smart about sections
        if height > 10000:
            # Extra tall - use percentage-based sections
            return self._create_percentage_sections(width, height)
        elif height > 5000:
            # Tall - use hybrid approach
            return self._create_hybrid_sections(img, width, height)
        else:
            # Normal height - use standard sections
            return self._create_standard_sections(img, width, height)
    
    def _create_standard_sections(self, img: Image.Image, width: int, height: int) -> List[Dict]:
        """Create sections for normal height pages"""
        sections = []
        current_y = 0
        
        # 1. Header (5-15% or 150px max)
        header_height = min(max(int(height * 0.05), 80), 150)
        sections.append({
            'type': 'header',
            'bounds': (0, current_y, width, header_height)
        })
        current_y += header_height
        
        # 2. Hero/Banner (15-25% or 400-600px)
        hero_height = min(max(int(height * 0.20), 300), 600)
        if current_y + hero_height < height * 0.4:
            sections.append({
                'type': 'hero',
                'bounds': (0, current_y, width, hero_height)
            })
            current_y += hero_height
        
        # 3. Main Content (whatever remains minus footer)
        footer_height = min(max(int(height * 0.10), 150), 300)
        content_height = height - current_y - footer_height
        
        if content_height > 300:
            sections.append({
                'type': 'content',
                'bounds': (0, current_y, width, content_height)
            })
            current_y += content_height
        
        # 4. Footer
        sections.append({
            'type': 'footer',
            'bounds': (0, current_y, width, height - current_y)
        })
        
        return sections
    
    def _create_hybrid_sections(self, img: Image.Image, width: int, height: int) -> List[Dict]:
        """Create sections for tall pages using visual analysis"""
        sections = []
        current_y = 0
        
        # 1. Header (fixed small size)
        header_height = min(150, int(height * 0.03))
        sections.append({
            'type': 'header',
            'bounds': (0, current_y, width, header_height)
        })
        current_y += header_height
        
        # 2. First major section (hero/intro)
        first_section_height = min(800, int(height * 0.15))
        sections.append({
            'type': 'hero',
            'bounds': (0, current_y, width, first_section_height)
        })
        current_y += first_section_height
        
        # 3. Find natural breaks in the middle
        remaining_height = height - current_y - 300  # Reserve for footer
        num_middle_sections = min(2, max(1, remaining_height // 1500))
        
        section_height = remaining_height // num_middle_sections
        for i in range(num_middle_sections):
            section_type = 'features' if i == 0 else 'content'
            sections.append({
                'type': section_type,
                'bounds': (0, current_y, width, section_height)
            })
            current_y += section_height
        
        # 4. Footer
        sections.append({
            'type': 'footer',
            'bounds': (0, current_y, width, height - current_y)
        })
        
        return sections
    
    def _create_percentage_sections(self, width: int, height: int) -> List[Dict]:
        """Create sections for very tall pages using percentages"""
        # For very tall pages, use fixed percentages
        sections = [
            {
                'type': 'header',
                'bounds': (0, 0, width, int(height * 0.02))
            },
            {
                'type': 'hero',
                'bounds': (0, int(height * 0.02), width, int(height * 0.10))
            },
            {
                'type': 'features',
                'bounds': (0, int(height * 0.12), width, int(height * 0.35))
            },
            {
                'type': 'content',
                'bounds': (0, int(height * 0.47), width, int(height * 0.35))
            },
            {
                'type': 'footer',
                'bounds': (0, int(height * 0.82), width, int(height * 0.18))
            }
        ]
        
        # Adjust bounds to be non-overlapping
        for i in range(len(sections)):
            x, y, w, h = sections[i]['bounds']
            if i == 0:
                sections[i]['bounds'] = (0, 0, width, h)
            else:
                prev_bottom = sections[i-1]['bounds'][1] + sections[i-1]['bounds'][3]
                sections[i]['bounds'] = (0, prev_bottom, width, h)
        
        # Adjust last section to reach bottom
        last = sections[-1]
        last['bounds'] = (0, last['bounds'][1], width, height - last['bounds'][1])
        
        return sections
    
    def _create_preview(self, img: Image.Image, sections: List[Dict], output_dir: str):
        """Create a preview showing section boundaries"""
        # Scale down for preview
        width, height = img.size
        max_height = 1500
        scale = min(1.0, max_height / height)
        
        preview_size = (int(width * scale), int(height * scale))
        preview = img.resize(preview_size, Image.Resampling.LANCZOS)
        
        draw = ImageDraw.Draw(preview)
        
        colors = {
            'header': '#FF3333',
            'hero': '#33AA33',
            'features': '#3366FF',
            'content': '#AA33AA',
            'footer': '#666666'
        }
        
        for section in sections:
            x, y, w, h = section['bounds']
            x, y, w, h = int(x*scale), int(y*scale), int(w*scale), int(h*scale)
            
            color = colors.get(section['type'], '#000000')
            
            # Draw rectangle with thick border
            for i in range(3):
                draw.rectangle([x+i, y+i, x+w-i-1, y+h-i-1], outline=color)
            
            # Add label
            label = f"{section['type'].upper()} ({section['position']}/{section['of_total']})"
            bbox = draw.textbbox((x+10, y+10), label)
            draw.rectangle([bbox[0]-5, bbox[1]-3, bbox[2]+5, bbox[3]+3], fill='white')
            draw.text((x+10, y+10), label, fill=color)
        
        preview.save(os.path.join(output_dir, 'preview.png'))


def main():
    import sys
    
    if len(sys.argv) > 1:
        input_path = sys.argv[1]
        output_dir = sys.argv[2] if len(sys.argv) > 2 else 'clean_sections'
    else:
        # Process all screenshots
        input_path = '.'
        output_dir = 'clean_sections'
    
    extractor = CleanSectionExtractor()
    
    input_path = Path(input_path)
    if input_path.is_file():
        # Single file
        output_subdir = Path(output_dir) / input_path.stem.replace(' ', '_').lower()
        extractor.extract_sections(str(input_path), str(output_subdir))
    else:
        # Directory
        screenshots = list(input_path.glob('*.png')) + list(input_path.glob('*.jpg'))
        
        print(f"Found {len(screenshots)} screenshots")
        
        for screenshot in screenshots:
            print(f"\nProcessing: {screenshot.name}")
            output_subdir = Path(output_dir) / screenshot.stem.replace(' ', '_').lower()
            
            try:
                extractor.extract_sections(str(screenshot), str(output_subdir))
            except Exception as e:
                print(f"  Error: {str(e)}")


if __name__ == "__main__":
    main()