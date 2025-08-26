#!/usr/bin/env python3
"""
Unified Screenshot Segmentation Tool
Segments full-page website screenshots into individual components
"""

import os
import json
import sys
from pathlib import Path
from typing import List, Dict, Tuple
from PIL import Image, ImageDraw, ImageFilter
import hashlib
import argparse


class ScreenshotSegmenter:
    """Main segmentation class that handles component detection and extraction"""
    
    def __init__(self, min_component_size=50, mode='basic'):
        self.min_component_size = min_component_size
        self.mode = mode
        
    def process_screenshot(self, image_path: str, output_dir: str) -> Dict:
        """Process a single screenshot and extract components"""
        try:
            img = Image.open(image_path).convert('RGB')
            width, height = img.size
            
            print(f"  Image dimensions: {width}x{height}")
            
            # Handle very large images by resizing for analysis
            max_height = 5000
            if height > max_height:
                print(f"  Image is very tall ({height}px), processing in segments...")
                # Process in segments instead of resizing
                return self._process_tall_screenshot(img, width, height, output_dir)
            
            # Detect components based on mode
            if self.mode == 'basic':
                components = self._basic_segmentation(img, width, height)
            elif self.mode == 'advanced':
                components = self._advanced_segmentation(img, width, height)
            else:
                components = self._grid_segmentation(img, width, height)
            
            # Filter valid components
            valid_components = []
            for comp in components:
                if self._is_valid_component(comp, width, height):
                    comp['type'] = self._classify_component(comp, width, height)
                    valid_components.append(comp)
            
            # Save components
            Path(output_dir).mkdir(parents=True, exist_ok=True)
            saved_components = self._save_components(img, valid_components, output_dir)
            
            # Save metadata
            metadata = {
                'source_image': image_path,
                'image_dimensions': {'width': width, 'height': height},
                'total_components': len(saved_components),
                'segmentation_mode': self.mode,
                'components': saved_components
            }
            
            metadata_path = os.path.join(output_dir, 'metadata.json')
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            # Create preview
            self._create_preview(img, saved_components, output_dir)
            
            return {
                'success': True,
                'components_found': len(saved_components),
                'output_dir': output_dir
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _basic_segmentation(self, img: Image.Image, width: int, height: int) -> List[Dict]:
        """Basic segmentation using common web layout patterns"""
        components = []
        
        # Header (top 15% or 150px, whichever is smaller)
        header_height = min(int(height * 0.15), 150)
        if header_height >= self.min_component_size:
            components.append({
                'x': 0, 'y': 0,
                'width': width, 'height': header_height,
                'suggested_type': 'header'
            })
        
        # Footer (bottom 20% or 200px, whichever is smaller)
        footer_height = min(int(height * 0.2), 200)
        if footer_height >= self.min_component_size:
            components.append({
                'x': 0, 'y': height - footer_height,
                'width': width, 'height': footer_height,
                'suggested_type': 'footer'
            })
        
        # Main content area
        content_y = header_height
        content_height = height - header_height - footer_height
        if content_height >= self.min_component_size:
            # Check for sidebar layouts
            # Left sidebar (20% width)
            sidebar_width = int(width * 0.2)
            if sidebar_width >= self.min_component_size:
                components.append({
                    'x': 0, 'y': content_y,
                    'width': sidebar_width, 'height': content_height,
                    'suggested_type': 'sidebar'
                })
                
                # Main content next to sidebar
                components.append({
                    'x': sidebar_width, 'y': content_y,
                    'width': width - sidebar_width, 'height': content_height,
                    'suggested_type': 'main_content'
                })
            else:
                # Full width content
                components.append({
                    'x': 0, 'y': content_y,
                    'width': width, 'height': content_height,
                    'suggested_type': 'main_content'
                })
        
        # Add section-based components
        sections = self._detect_sections(img, width, height)
        components.extend(sections)
        
        return self._deduplicate_components(components)
    
    def _process_tall_screenshot(self, img: Image.Image, width: int, height: int, output_dir: str) -> Dict:
        """Process very tall screenshots by segmenting in chunks"""
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Process in segments of max 2000px height
        segment_height = 2000
        overlap = 100  # Overlap between segments to catch components at boundaries
        
        all_components = []
        segment_count = 0
        
        for y_start in range(0, height, segment_height - overlap):
            y_end = min(y_start + segment_height, height)
            segment_count += 1
            
            print(f"    Processing segment {segment_count} (y: {y_start}-{y_end})")
            
            # Extract segment
            segment = img.crop((0, y_start, width, y_end))
            segment_h = y_end - y_start
            
            # Detect components in this segment
            if self.mode == 'basic':
                components = self._basic_segmentation(segment, width, segment_h)
            else:
                components = self._grid_segmentation(segment, width, segment_h)
            
            # Adjust component positions to global coordinates
            for comp in components:
                comp['y'] += y_start
                comp['type'] = self._classify_component(comp, width, height)
                if self._is_valid_component(comp, width, height):
                    all_components.append(comp)
        
        # Deduplicate components across segments
        all_components = self._deduplicate_components(all_components)
        
        # Save components
        saved_components = self._save_components(img, all_components, output_dir)
        
        # Save metadata
        metadata = {
            'source_image': img.filename if hasattr(img, 'filename') else 'unknown',
            'image_dimensions': {'width': width, 'height': height},
            'total_components': len(saved_components),
            'segmentation_mode': self.mode,
            'segments_processed': segment_count,
            'components': saved_components
        }
        
        metadata_path = os.path.join(output_dir, 'metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # For very tall images, create a smaller preview
        preview_scale = min(1.0, 2000 / height)
        preview_h = int(height * preview_scale)
        preview_w = int(width * preview_scale)
        preview_img = img.resize((preview_w, preview_h), Image.Resampling.LANCZOS)
        
        # Scale components for preview
        preview_components = []
        for comp in saved_components:
            preview_comp = comp.copy()
            dims = preview_comp['dimensions']
            preview_comp['dimensions'] = {
                'x': int(dims['x'] * preview_scale),
                'y': int(dims['y'] * preview_scale),
                'width': int(dims['width'] * preview_scale),
                'height': int(dims['height'] * preview_scale)
            }
            preview_components.append(preview_comp)
        
        self._create_preview(preview_img, preview_components, output_dir)
        
        return {
            'success': True,
            'components_found': len(saved_components),
            'output_dir': output_dir,
            'note': f'Processed tall image ({height}px) in {segment_count} segments'
        }
    
    def _advanced_segmentation(self, img: Image.Image, width: int, height: int) -> List[Dict]:
        """Advanced segmentation using edge detection"""
        gray = img.convert('L')
        
        # Apply edge detection
        edges = gray.filter(ImageFilter.FIND_EDGES)
        edge_data = edges.load()
        
        # Find horizontal and vertical lines
        h_lines = self._find_lines(edge_data, width, height, 'horizontal')
        v_lines = self._find_lines(edge_data, width, height, 'vertical')
        
        # Create components from line intersections
        components = []
        for i in range(len(h_lines) - 1):
            for j in range(len(v_lines) - 1):
                x1, x2 = v_lines[j], v_lines[j + 1]
                y1, y2 = h_lines[i], h_lines[i + 1]
                
                if (x2 - x1 >= self.min_component_size and 
                    y2 - y1 >= self.min_component_size):
                    components.append({
                        'x': x1, 'y': y1,
                        'width': x2 - x1, 'height': y2 - y1
                    })
        
        return self._deduplicate_components(components)
    
    def _grid_segmentation(self, img: Image.Image, width: int, height: int) -> List[Dict]:
        """Grid-based segmentation for detecting card layouts"""
        components = []
        
        # Try different grid sizes
        grid_sizes = [200, 300, 400]
        
        for grid_size in grid_sizes:
            cols = width // grid_size
            rows = height // grid_size
            
            for row in range(rows):
                for col in range(cols):
                    x = col * grid_size
                    y = row * grid_size
                    w = min(grid_size, width - x)
                    h = min(grid_size, height - y)
                    
                    if w >= self.min_component_size and h >= self.min_component_size:
                        components.append({
                            'x': x, 'y': y,
                            'width': w, 'height': h,
                            'suggested_type': 'card'
                        })
        
        return self._deduplicate_components(components)
    
    def _detect_sections(self, img: Image.Image, width: int, height: int) -> List[Dict]:
        """Detect sections based on color changes"""
        sections = []
        
        # Sample colors at different heights
        sample_height = 50
        current_section_start = 0
        
        for y in range(0, height - sample_height, sample_height):
            # Get average color for this band
            band = img.crop((0, y, width, y + sample_height))
            avg_color = self._get_average_color(band)
            
            # Check if color changed significantly from previous
            if y > 0:
                prev_band = img.crop((0, y - sample_height, width, y))
                prev_color = self._get_average_color(prev_band)
                
                if self._color_distance(avg_color, prev_color) > 50:
                    # Section boundary detected
                    if y - current_section_start >= self.min_component_size:
                        sections.append({
                            'x': 0, 'y': current_section_start,
                            'width': width, 'height': y - current_section_start,
                            'suggested_type': 'section'
                        })
                    current_section_start = y
        
        # Add final section
        if height - current_section_start >= self.min_component_size:
            sections.append({
                'x': 0, 'y': current_section_start,
                'width': width, 'height': height - current_section_start,
                'suggested_type': 'section'
            })
        
        return sections
    
    def _find_lines(self, edge_data, width: int, height: int, direction: str) -> List[int]:
        """Find significant lines in edge image"""
        lines = [0]
        threshold = 0.3  # 30% of pixels must be edges
        
        if direction == 'horizontal':
            for y in range(height):
                edge_count = sum(1 for x in range(width) if edge_data[x, y] > 128)
                if edge_count > width * threshold:
                    if not lines or y - lines[-1] > 20:  # Min gap between lines
                        lines.append(y)
            lines.append(height - 1)
        else:  # vertical
            for x in range(width):
                edge_count = sum(1 for y in range(height) if edge_data[x, y] > 128)
                if edge_count > height * threshold:
                    if not lines or x - lines[-1] > 20:  # Min gap between lines
                        lines.append(x)
            lines.append(width - 1)
        
        return sorted(list(set(lines)))
    
    def _get_average_color(self, img: Image.Image) -> Tuple[int, int, int]:
        """Get average color of an image region"""
        pixels = list(img.getdata())
        if not pixels:
            return (255, 255, 255)
        
        r = sum(p[0] for p in pixels) // len(pixels)
        g = sum(p[1] for p in pixels) // len(pixels)
        b = sum(p[2] for p in pixels) // len(pixels)
        
        return (r, g, b)
    
    def _color_distance(self, c1: Tuple[int, int, int], c2: Tuple[int, int, int]) -> float:
        """Calculate distance between two colors"""
        return ((c1[0] - c2[0])**2 + (c1[1] - c2[1])**2 + (c1[2] - c2[2])**2) ** 0.5
    
    def _deduplicate_components(self, components: List[Dict]) -> List[Dict]:
        """Remove overlapping components"""
        if not components:
            return []
        
        # Sort by area (larger first)
        components.sort(key=lambda c: c['width'] * c['height'], reverse=True)
        
        unique = []
        for comp in components:
            is_duplicate = False
            for existing in unique:
                if self._overlap_ratio(comp, existing) > 0.8:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique.append(comp)
        
        return unique
    
    def _overlap_ratio(self, comp1: Dict, comp2: Dict) -> float:
        """Calculate overlap ratio between two components"""
        x1 = max(comp1['x'], comp2['x'])
        y1 = max(comp1['y'], comp2['y'])
        x2 = min(comp1['x'] + comp1['width'], comp2['x'] + comp2['width'])
        y2 = min(comp1['y'] + comp1['height'], comp2['y'] + comp2['height'])
        
        if x2 < x1 or y2 < y1:
            return 0.0
        
        intersection = (x2 - x1) * (y2 - y1)
        area1 = comp1['width'] * comp1['height']
        area2 = comp2['width'] * comp2['height']
        
        return intersection / min(area1, area2)
    
    def _is_valid_component(self, comp: Dict, img_width: int, img_height: int) -> bool:
        """Check if component is valid"""
        w, h = comp['width'], comp['height']
        
        # Size constraints
        if w < self.min_component_size or h < self.min_component_size:
            return False
        
        # Not too large (avoid full page)
        if w > img_width * 0.95 and h > img_height * 0.95:
            return False
        
        # Reasonable aspect ratio
        aspect_ratio = w / h if h > 0 else 0
        if aspect_ratio > 20 or aspect_ratio < 0.05:
            return False
        
        return True
    
    def _classify_component(self, comp: Dict, img_width: int, img_height: int) -> str:
        """Classify component type based on various features"""
        x, y, w, h = comp['x'], comp['y'], comp['width'], comp['height']
        aspect_ratio = w / h if h > 0 else 0
        
        # Use suggested type if available
        if 'suggested_type' in comp:
            return comp['suggested_type']
        
        # Position-based classification
        if y < img_height * 0.15:
            if w > img_width * 0.8:
                return "header"
            elif aspect_ratio > 3:
                return "navigation"
        elif y > img_height * 0.85:
            return "footer"
        
        # Size-based classification
        if aspect_ratio > 3:
            return "banner"
        elif w < img_width * 0.3 and h > img_height * 0.3:
            return "sidebar"
        elif 0.8 < aspect_ratio < 1.2 and w < 400:
            return "card"
        elif h < 100 and w < 200:
            return "button"
        elif w * h > img_width * img_height * 0.3:
            return "main_content"
        else:
            return "section"
    
    def _save_components(self, img: Image.Image, components: List[Dict], output_dir: str) -> List[Dict]:
        """Save component images and return metadata"""
        saved = []
        
        for i, comp in enumerate(components):
            # Generate unique ID
            comp_id = hashlib.md5(
                f"{comp['x']}{comp['y']}{comp['width']}{comp['height']}".encode()
            ).hexdigest()[:8]
            
            # Extract component image
            x, y, w, h = comp['x'], comp['y'], comp['width'], comp['height']
            component_img = img.crop((x, y, x + w, y + h))
            
            # Check if component has actual content (not just white/uniform)
            pixels = list(component_img.getdata())
            unique_colors = len(set(pixels))
            
            if unique_colors > 10:  # Has some variation
                # Save image
                filename = f"{comp['type']}_{i+1:03d}_{comp_id}.png"
                filepath = os.path.join(output_dir, filename)
                component_img.save(filepath)
                
                # Create metadata
                comp_metadata = {
                    'id': comp_id,
                    'type': comp['type'],
                    'filename': filename,
                    'dimensions': {
                        'x': x, 'y': y,
                        'width': w, 'height': h
                    },
                    'area': w * h,
                    'aspect_ratio': w / h if h > 0 else 0
                }
                
                saved.append(comp_metadata)
        
        return saved
    
    def _create_preview(self, img: Image.Image, components: List[Dict], output_dir: str):
        """Create preview image with component boundaries"""
        preview = img.copy()
        draw = ImageDraw.Draw(preview)
        
        # Color map for different component types
        colors = {
            'header': '#FF0000',
            'footer': '#0000FF',
            'navigation': '#00FF00',
            'sidebar': '#FFA500',
            'main_content': '#800080',
            'card': '#00FFFF',
            'button': '#FFFF00',
            'banner': '#FF00FF',
            'section': '#808080'
        }
        
        # Draw component boundaries
        for comp in components:
            dims = comp['dimensions']
            x, y = dims['x'], dims['y']
            w, h = dims['width'], dims['height']
            color = colors.get(comp['type'], '#000000')
            
            # Draw rectangle
            draw.rectangle([x, y, x + w, y + h], outline=color, width=2)
            
            # Add label
            label = f"{comp['type']} ({comp['id'][:4]})"
            draw.text((x + 5, y + 5), label, fill=color)
        
        # Save preview
        preview_path = os.path.join(output_dir, 'preview.png')
        preview.save(preview_path)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Segment website screenshots into components',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s input_dir output_dir
  %(prog)s input_dir output_dir --mode advanced
  %(prog)s input_dir output_dir --min-size 100
        """
    )
    
    parser.add_argument('input_dir', help='Directory containing screenshots')
    parser.add_argument('output_dir', help='Directory for segmented components')
    parser.add_argument('--mode', choices=['basic', 'advanced', 'grid'], 
                        default='basic', help='Segmentation mode (default: basic)')
    parser.add_argument('--min-size', type=int, default=50,
                        help='Minimum component size in pixels (default: 50)')
    
    args = parser.parse_args()
    
    # Initialize segmenter
    segmenter = ScreenshotSegmenter(
        min_component_size=args.min_size,
        mode=args.mode
    )
    
    # Process screenshots
    input_path = Path(args.input_dir)
    output_path = Path(args.output_dir)
    
    # Find all image files
    image_extensions = ['.png', '.jpg', '.jpeg', '.webp']
    image_files = [f for f in input_path.iterdir() 
                   if f.suffix.lower() in image_extensions]
    
    if not image_files:
        print(f"No image files found in {input_path}")
        return
    
    print(f"Found {len(image_files)} screenshots to process")
    print(f"Mode: {args.mode}, Min size: {args.min_size}px")
    print("-" * 50)
    
    # Process each screenshot
    success_count = 0
    for image_file in image_files:
        print(f"\nProcessing: {image_file.name}")
        
        # Create output subdirectory for this screenshot
        website_name = image_file.stem.replace(' ', '_').lower()
        website_output_dir = output_path / website_name
        
        # Process screenshot
        result = segmenter.process_screenshot(
            str(image_file),
            str(website_output_dir)
        )
        
        if result['success']:
            print(f"  ✓ Extracted {result['components_found']} components")
            print(f"  → Saved to: {result['output_dir']}")
            success_count += 1
        else:
            print(f"  ✗ Error: {result['error']}")
    
    print("\n" + "-" * 50)
    print(f"Processing complete! Successfully processed {success_count}/{len(image_files)} screenshots")
    print(f"Results saved to: {output_path}")


if __name__ == "__main__":
    main()