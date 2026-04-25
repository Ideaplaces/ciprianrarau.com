#!/usr/bin/env python3
"""
Smart Section Extractor
Extracts meaningful website sections from screenshots using visual analysis
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Tuple
from PIL import Image, ImageDraw
import numpy as np


class SmartSectionExtractor:
    """Extract meaningful sections from website screenshots"""
    
    def __init__(self):
        self.min_section_height = 100
        self.min_section_width = 300
        
    def extract_sections(self, image_path: str, output_dir: str) -> Dict:
        """Extract meaningful sections from a screenshot"""
        img = Image.open(image_path).convert('RGB')
        width, height = img.size
        
        print(f"Analyzing image: {width}x{height}px")
        
        # Create output directory
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Detect major sections
        sections = self._detect_sections(img)
        
        # Extract common website patterns
        extracted = []
        
        # 1. Header (top section with consistent background)
        header = self._extract_header(img, sections)
        if header:
            extracted.append(header)
        
        # 2. Hero section (large section after header)
        hero = self._extract_hero(img, sections, header)
        if hero:
            extracted.append(hero)
        
        # 3. Content sections (major visual blocks)
        content_sections = self._extract_content_sections(img, sections, extracted)
        extracted.extend(content_sections)
        
        # 4. Footer (bottom section)
        footer = self._extract_footer(img, sections)
        if footer:
            extracted.append(footer)
        
        # Save extracted sections
        saved_sections = []
        for i, section in enumerate(extracted):
            # Extract and save section image
            x, y, w, h = section['bounds']
            section_img = img.crop((x, y, x + w, y + h))
            
            filename = f"{section['type']}_{i+1:02d}.png"
            filepath = os.path.join(output_dir, filename)
            section_img.save(filepath)
            
            saved_sections.append({
                'type': section['type'],
                'filename': filename,
                'bounds': section['bounds'],
                'description': section.get('description', '')
            })
            
            print(f"  Saved {section['type']} section: {w}x{h}px")
        
        # Create preview
        self._create_preview(img, saved_sections, output_dir)
        
        # Save metadata
        metadata = {
            'source_image': os.path.basename(image_path),
            'image_dimensions': {'width': width, 'height': height},
            'sections_extracted': len(saved_sections),
            'sections': saved_sections
        }
        
        with open(os.path.join(output_dir, 'metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return metadata
    
    def _detect_sections(self, img: Image.Image) -> List[Dict]:
        """Detect major visual sections in the image"""
        width, height = img.size
        img_array = np.array(img)
        
        sections = []
        
        # Analyze horizontal bands for color/content changes
        band_height = 10
        prev_signature = None
        section_start = 0
        
        for y in range(0, height - band_height, band_height):
            # Get visual signature of this band
            band = img_array[y:y+band_height, :, :]
            signature = self._get_band_signature(band)
            
            if prev_signature is not None:
                # Check if this is a section boundary
                if self._is_section_boundary(prev_signature, signature):
                    if y - section_start >= self.min_section_height:
                        sections.append({
                            'start_y': section_start,
                            'end_y': y,
                            'height': y - section_start,
                            'signature': prev_signature
                        })
                    section_start = y
            
            prev_signature = signature
        
        # Add final section
        if height - section_start >= self.min_section_height:
            sections.append({
                'start_y': section_start,
                'end_y': height,
                'height': height - section_start,
                'signature': prev_signature
            })
        
        return sections
    
    def _get_band_signature(self, band: np.ndarray) -> Dict:
        """Get visual signature of a horizontal band"""
        # Calculate average color
        avg_color = np.mean(band, axis=(0, 1))
        
        # Calculate color variance (indicates content vs solid color)
        color_variance = np.std(band.reshape(-1, 3), axis=0)
        
        # Calculate edge density (indicates text/content)
        gray = np.mean(band, axis=2)
        edges = np.abs(np.diff(gray, axis=1))
        edge_density = np.mean(edges)
        
        return {
            'avg_color': avg_color.tolist(),
            'color_variance': np.mean(color_variance),
            'edge_density': edge_density,
            'is_mostly_white': np.all(avg_color > 240),
            'is_mostly_dark': np.all(avg_color < 50)
        }
    
    def _is_section_boundary(self, sig1: Dict, sig2: Dict) -> bool:
        """Determine if two signatures represent a section boundary"""
        # Color change threshold
        color_diff = np.linalg.norm(
            np.array(sig1['avg_color']) - np.array(sig2['avg_color'])
        )
        
        # Significant color change
        if color_diff > 30:
            return True
        
        # Change from content to whitespace or vice versa
        if sig1['edge_density'] > 5 and sig2['edge_density'] < 2:
            return True
        if sig1['edge_density'] < 2 and sig2['edge_density'] > 5:
            return True
        
        # Change from white to colored or vice versa
        if sig1['is_mostly_white'] != sig2['is_mostly_white']:
            return True
        
        return False
    
    def _extract_header(self, img: Image.Image, sections: List[Dict]) -> Dict:
        """Extract header section"""
        width, height = img.size
        
        # Header is typically in the first 10-20% of the page
        max_header_height = min(int(height * 0.2), 300)
        
        for section in sections:
            if section['start_y'] == 0 and section['height'] <= max_header_height:
                # Check if it looks like a header (often has consistent bg)
                if section['signature']['color_variance'] < 50:
                    return {
                        'type': 'header',
                        'bounds': (0, 0, width, section['end_y']),
                        'description': 'Website header with navigation'
                    }
        
        # Fallback: use top portion
        header_height = min(150, int(height * 0.1))
        return {
            'type': 'header',
            'bounds': (0, 0, width, header_height),
            'description': 'Top header section'
        }
    
    def _extract_hero(self, img: Image.Image, sections: List[Dict], header: Dict) -> Dict:
        """Extract hero/banner section"""
        width, height = img.size
        header_bottom = header['bounds'][3] if header else 0
        
        # Hero is typically a large section after header
        for section in sections:
            if (section['start_y'] >= header_bottom and 
                section['height'] >= 300 and
                section['start_y'] < height * 0.5):
                
                # Check if it's visually prominent
                if (section['signature']['color_variance'] > 20 or
                    not section['signature']['is_mostly_white']):
                    
                    return {
                        'type': 'hero',
                        'bounds': (0, section['start_y'], width, section['end_y']),
                        'description': 'Hero/banner section'
                    }
        
        return None
    
    def _extract_content_sections(self, img: Image.Image, sections: List[Dict], 
                                  existing: List[Dict]) -> List[Dict]:
        """Extract main content sections"""
        width, height = img.size
        content_sections = []
        
        # Get bounds of existing sections
        used_ranges = [(s['bounds'][1], s['bounds'][3]) for s in existing]
        
        # Look for significant sections not yet extracted
        for section in sections:
            # Skip if already covered
            overlaps = any(
                section['start_y'] < end and section['end_y'] > start
                for start, end in used_ranges
            )
            
            if not overlaps and section['height'] >= 200:
                # Determine content type based on position and characteristics
                section_type = 'content'
                
                # Middle sections are often features/services
                if height * 0.3 < section['start_y'] < height * 0.7:
                    if section['signature']['edge_density'] > 5:
                        section_type = 'features'
                
                # Sections with high variance might be testimonials/gallery
                elif section['signature']['color_variance'] > 50:
                    section_type = 'showcase'
                
                content_sections.append({
                    'type': section_type,
                    'bounds': (0, section['start_y'], width, section['end_y']),
                    'description': f'{section_type.capitalize()} section'
                })
                
                used_ranges.append((section['start_y'], section['end_y']))
                
                # Limit to 3-4 content sections
                if len(content_sections) >= 3:
                    break
        
        return content_sections
    
    def _extract_footer(self, img: Image.Image, sections: List[Dict]) -> Dict:
        """Extract footer section"""
        width, height = img.size
        
        # Footer is typically in the last 10-20% of the page
        min_footer_y = int(height * 0.8)
        
        for section in reversed(sections):
            if section['end_y'] == height and section['start_y'] >= min_footer_y:
                # Check if it looks like a footer (often darker or different bg)
                if (section['signature']['is_mostly_dark'] or 
                    section['signature']['color_variance'] < 30):
                    
                    return {
                        'type': 'footer',
                        'bounds': (0, section['start_y'], width, height),
                        'description': 'Website footer'
                    }
        
        # Fallback: use bottom portion
        footer_height = min(300, int(height * 0.15))
        return {
            'type': 'footer',
            'bounds': (0, height - footer_height, width, height),
            'description': 'Bottom footer section'
        }
    
    def _create_preview(self, img: Image.Image, sections: List[Dict], output_dir: str):
        """Create preview showing extracted sections"""
        # Create a scaled preview for very tall images
        width, height = img.size
        scale = min(1.0, 2000 / height)
        
        if scale < 1.0:
            preview_size = (int(width * scale), int(height * scale))
            preview = img.resize(preview_size, Image.Resampling.LANCZOS)
        else:
            preview = img.copy()
        
        draw = ImageDraw.Draw(preview)
        
        colors = {
            'header': 'red',
            'hero': 'green',
            'content': 'blue',
            'features': 'orange',
            'showcase': 'purple',
            'footer': 'brown'
        }
        
        for section in sections:
            x, y, w, h = section['bounds']
            # Scale coordinates if preview is scaled
            if scale < 1.0:
                x, y, w, h = int(x*scale), int(y*scale), int(w*scale), int(h*scale)
            
            color = colors.get(section['type'], 'gray')
            # Draw rectangle
            draw.rectangle([x, y, x + w - 1, y + h - 1], outline=color, width=3)
            # Add label
            draw.text((x + 10, y + 10), section['type'].upper(), fill=color)
        
        preview.save(os.path.join(output_dir, 'preview.png'))


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Extract meaningful sections from website screenshots'
    )
    parser.add_argument('input', help='Screenshot file or directory')
    parser.add_argument('output_dir', help='Output directory for sections')
    
    args = parser.parse_args()
    
    extractor = SmartSectionExtractor()
    
    # Handle single file or directory
    input_path = Path(args.input)
    
    if input_path.is_file():
        # Process single file
        website_name = input_path.stem.replace(' ', '_').lower()
        output_path = Path(args.output_dir) / website_name
        
        print(f"Extracting sections from: {input_path.name}")
        extractor.extract_sections(str(input_path), str(output_path))
        
    elif input_path.is_dir():
        # Process all images in directory
        image_files = [f for f in input_path.iterdir() 
                       if f.suffix.lower() in ['.png', '.jpg', '.jpeg']]
        
        print(f"Found {len(image_files)} screenshots")
        
        for img_file in image_files:
            print(f"\nProcessing: {img_file.name}")
            website_name = img_file.stem.replace(' ', '_').lower()
            output_path = Path(args.output_dir) / website_name
            
            try:
                extractor.extract_sections(str(img_file), str(output_path))
            except Exception as e:
                print(f"  Error: {str(e)}")
    
    print("\nDone!")


if __name__ == "__main__":
    main()