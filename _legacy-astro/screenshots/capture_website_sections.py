#!/usr/bin/env python3
"""
Website Section Capture Tool
Captures meaningful website sections based on HTML structure
"""

import os
import json
import time
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from urllib.parse import urlparse
import argparse

# Try to import Playwright
try:
    from playwright.sync_api import sync_playwright, Page, Locator
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("Note: Install playwright for better screenshot capture: pip install playwright")
    print("Then run: playwright install chromium")

# Fallback to selenium if playwright not available
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False


class WebsiteSectionCapture:
    """Captures meaningful sections from websites based on HTML structure"""
    
    # Common section selectors for different types of content
    SECTION_PATTERNS = {
        'header': [
            'header', 
            'nav',
            '[role="banner"]',
            '.header', 
            '#header',
            '.navbar',
            '.navigation'
        ],
        'hero': [
            '.hero',
            '#hero',
            'section.hero',
            '.hero-section',
            '.banner-section',
            '.jumbotron',
            'section:first-of-type',
            'main > section:first-child'
        ],
        'features': [
            '.features',
            '#features',
            'section.features',
            '.features-section',
            '.services',
            '.benefits',
            '[class*="feature"]'
        ],
        'about': [
            '.about',
            '#about',
            'section.about',
            '.about-section',
            '.about-us'
        ],
        'testimonials': [
            '.testimonials',
            '#testimonials',
            'section.testimonials',
            '.reviews',
            '.testimonials-section'
        ],
        'pricing': [
            '.pricing',
            '#pricing',
            'section.pricing',
            '.pricing-section',
            '.plans'
        ],
        'cta': [
            '.cta',
            '.call-to-action',
            'section.cta',
            '.cta-section'
        ],
        'footer': [
            'footer',
            '[role="contentinfo"]',
            '.footer',
            '#footer'
        ]
    }
    
    def __init__(self, headless: bool = False):
        self.headless = headless
        self.driver = None
        self.playwright = None
        self.browser = None
        self.page = None
        
    def setup_browser(self, use_playwright: bool = True):
        """Setup browser for capturing screenshots"""
        if use_playwright and PLAYWRIGHT_AVAILABLE:
            self.playwright = sync_playwright().start()
            self.browser = self.playwright.chromium.launch(headless=self.headless)
            self.page = self.browser.new_page(viewport={'width': 1920, 'height': 1080})
            return 'playwright'
        elif SELENIUM_AVAILABLE:
            options = Options()
            if self.headless:
                options.add_argument('--headless')
            options.add_argument('--window-size=1920,1080')
            self.driver = webdriver.Chrome(options=options)
            return 'selenium'
        else:
            raise Exception("Neither Playwright nor Selenium is available. Please install one of them.")
    
    def cleanup(self):
        """Clean up browser resources"""
        if self.driver:
            self.driver.quit()
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
    
    def capture_website_sections(self, url: str, output_dir: str) -> Dict:
        """Capture meaningful sections from a website"""
        # Setup browser
        browser_type = self.setup_browser(use_playwright=PLAYWRIGHT_AVAILABLE)
        
        # Create output directory
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        try:
            # Load the website
            print(f"Loading website: {url}")
            if browser_type == 'playwright':
                self.page.goto(url, wait_until='networkidle')
                # Wait a bit for dynamic content
                self.page.wait_for_timeout(2000)
            else:
                self.driver.get(url)
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                time.sleep(2)
            
            # Find and capture sections
            sections = self._find_sections(browser_type)
            captured_sections = []
            
            print(f"Found {len(sections)} sections to capture")
            
            for section in sections:
                result = self._capture_section(section, output_dir, browser_type)
                if result:
                    captured_sections.append(result)
            
            # Capture full page for reference
            full_page_path = os.path.join(output_dir, 'full_page.png')
            if browser_type == 'playwright':
                self.page.screenshot(path=full_page_path, full_page=True)
            else:
                self.driver.save_screenshot(full_page_path)
            
            # Save metadata
            metadata = {
                'url': url,
                'capture_date': time.strftime('%Y-%m-%d %H:%M:%S'),
                'browser': browser_type,
                'sections_found': len(sections),
                'sections_captured': len(captured_sections),
                'sections': captured_sections
            }
            
            metadata_path = os.path.join(output_dir, 'metadata.json')
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            print(f"\nCapture complete!")
            print(f"  Sections captured: {len(captured_sections)}")
            print(f"  Output directory: {output_dir}")
            
            return metadata
            
        finally:
            self.cleanup()
    
    def _find_sections(self, browser_type: str) -> List[Dict]:
        """Find meaningful sections in the current page"""
        sections = []
        
        for section_type, selectors in self.SECTION_PATTERNS.items():
            for selector in selectors:
                try:
                    if browser_type == 'playwright':
                        elements = self.page.locator(selector).all()
                        for i, element in enumerate(elements[:3]):  # Limit to 3 per type
                            if element.is_visible():
                                bbox = element.bounding_box()
                                if bbox and bbox['height'] > 50:  # Min height
                                    sections.append({
                                        'type': section_type,
                                        'selector': selector,
                                        'index': i,
                                        'element': element,
                                        'bbox': bbox
                                    })
                                    break  # Found this section type
                    else:  # selenium
                        elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        for i, element in enumerate(elements[:3]):
                            if element.is_displayed():
                                size = element.size
                                if size['height'] > 50:  # Min height
                                    location = element.location
                                    sections.append({
                                        'type': section_type,
                                        'selector': selector,
                                        'index': i,
                                        'element': element,
                                        'bbox': {
                                            'x': location['x'],
                                            'y': location['y'],
                                            'width': size['width'],
                                            'height': size['height']
                                        }
                                    })
                                    break
                except Exception as e:
                    continue
        
        # Sort sections by vertical position
        sections.sort(key=lambda s: s['bbox']['y'])
        
        # Remove overlapping sections
        filtered_sections = []
        for section in sections:
            overlap = False
            for existing in filtered_sections:
                if self._sections_overlap(section['bbox'], existing['bbox']):
                    # Keep the one with more specific selector
                    if len(section['selector']) > len(existing['selector']):
                        filtered_sections.remove(existing)
                    else:
                        overlap = True
                    break
            
            if not overlap:
                filtered_sections.append(section)
        
        return filtered_sections
    
    def _sections_overlap(self, bbox1: Dict, bbox2: Dict) -> bool:
        """Check if two bounding boxes overlap significantly"""
        x1_min, y1_min = bbox1['x'], bbox1['y']
        x1_max = x1_min + bbox1['width']
        y1_max = y1_min + bbox1['height']
        
        x2_min, y2_min = bbox2['x'], bbox2['y']
        x2_max = x2_min + bbox2['width']
        y2_max = y2_min + bbox2['height']
        
        # Check for overlap
        x_overlap = x1_min < x2_max and x2_min < x1_max
        y_overlap = y1_min < y2_max and y2_min < y1_max
        
        if not (x_overlap and y_overlap):
            return False
        
        # Calculate overlap area
        overlap_width = min(x1_max, x2_max) - max(x1_min, x2_min)
        overlap_height = min(y1_max, y2_max) - max(y1_min, y2_min)
        overlap_area = overlap_width * overlap_height
        
        # Check if overlap is significant (>50% of smaller box)
        area1 = bbox1['width'] * bbox1['height']
        area2 = bbox2['width'] * bbox2['height']
        min_area = min(area1, area2)
        
        return overlap_area > min_area * 0.5
    
    def _capture_section(self, section: Dict, output_dir: str, browser_type: str) -> Optional[Dict]:
        """Capture a screenshot of a specific section"""
        try:
            section_type = section['type']
            bbox = section['bbox']
            
            # Generate filename
            filename = f"{section_type}_{section['index'] + 1:02d}.png"
            filepath = os.path.join(output_dir, filename)
            
            print(f"  Capturing {section_type} section...")
            
            if browser_type == 'playwright':
                # Scroll element into view
                section['element'].scroll_into_view_if_needed()
                time.sleep(0.5)  # Wait for scroll
                
                # Take screenshot of element
                section['element'].screenshot(path=filepath)
            else:  # selenium
                # Scroll element into view
                self.driver.execute_script("arguments[0].scrollIntoView(true);", section['element'])
                time.sleep(0.5)
                
                # Take screenshot and crop
                section['element'].screenshot(filepath)
            
            # Return metadata
            return {
                'type': section_type,
                'filename': filename,
                'selector': section['selector'],
                'dimensions': {
                    'x': int(bbox['x']),
                    'y': int(bbox['y']),
                    'width': int(bbox['width']),
                    'height': int(bbox['height'])
                }
            }
            
        except Exception as e:
            print(f"    Failed to capture {section['type']}: {str(e)}")
            return None


def main():
    parser = argparse.ArgumentParser(
        description='Capture meaningful sections from websites',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s https://example.com output/example
  %(prog)s https://example.com output/example --headless
  %(prog)s https://example.com output/example --sections header,hero,footer
        """
    )
    
    parser.add_argument('url', help='Website URL to capture')
    parser.add_argument('output_dir', help='Directory to save captured sections')
    parser.add_argument('--headless', action='store_true', 
                        help='Run browser in headless mode')
    
    args = parser.parse_args()
    
    # Extract domain name for output folder
    if args.output_dir == 'auto':
        domain = urlparse(args.url).netloc.replace('www.', '')
        args.output_dir = f"sections/{domain}"
    
    # Capture sections
    capture = WebsiteSectionCapture(headless=args.headless)
    capture.capture_website_sections(args.url, args.output_dir)


if __name__ == "__main__":
    main()