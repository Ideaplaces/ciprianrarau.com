#!/usr/bin/env python3
"""
Live Website Section Capture
Captures sections directly from live websites using Playwright
"""

import os
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Optional
from urllib.parse import urlparse


# Check if playwright is available
try:
    from playwright.async_api import async_playwright, Page
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("ERROR: Playwright not installed!")
    print("To install:")
    print("  pip3 install playwright")
    print("  playwright install chromium")
    exit(1)


class LiveWebsiteCapture:
    """Capture sections from live websites"""
    
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.viewport = {'width': 1920, 'height': 1080}
    
    async def capture_website(self, url: str, output_dir: str) -> Dict:
        """Capture sections from a live website"""
        async with async_playwright() as p:
            print(f"Launching browser...")
            browser = await p.chromium.launch(headless=self.headless)
            
            try:
                # Create new page
                page = await browser.new_page(viewport=self.viewport)
                
                # Navigate to website
                print(f"Loading {url}...")
                await page.goto(url, wait_until='networkidle')
                await page.wait_for_timeout(2000)  # Wait for dynamic content
                
                # Get page title for context
                title = await page.title()
                print(f"Page title: {title}")
                
                # Create output directory
                Path(output_dir).mkdir(parents=True, exist_ok=True)
                
                # Find and capture sections
                sections = await self._find_sections(page, url)
                
                # Capture each section
                captured = []
                for i, section in enumerate(sections):
                    print(f"  Capturing {section['type']}...")
                    result = await self._capture_section(page, section, output_dir, i + 1)
                    if result:
                        captured.append(result)
                
                # Capture full page screenshot
                print("  Capturing full page...")
                full_page_path = os.path.join(output_dir, 'full_page.png')
                await page.screenshot(path=full_page_path, full_page=True)
                
                # Get page dimensions
                dimensions = await page.evaluate('''() => {
                    return {
                        width: document.documentElement.scrollWidth,
                        height: document.documentElement.scrollHeight
                    }
                }''')
                
                # Save metadata
                metadata = {
                    'url': url,
                    'title': title,
                    'page_dimensions': dimensions,
                    'viewport': self.viewport,
                    'sections_captured': len(captured),
                    'sections': captured
                }
                
                with open(os.path.join(output_dir, 'metadata.json'), 'w') as f:
                    json.dump(metadata, f, indent=2)
                
                print(f"\nCapture complete! {len(captured)} sections saved to {output_dir}")
                return metadata
                
            finally:
                await browser.close()
    
    async def _find_sections(self, page: Page, url: str) -> List[Dict]:
        """Find major sections on the page"""
        sections = []
        
        # Common patterns for wehappers and similar sites
        selectors = {
            'header': ['header', 'nav', '.header', '#header', '[role="banner"]'],
            'hero': ['.hero', '.banner', '.jumbotron', 'section:first-of-type', '.hero-section'],
            'features': ['.features', '#features', '.services', '.benefits'],
            'about': ['.about', '#about', '.about-section'],
            'portfolio': ['.portfolio', '#portfolio', '.projects', '.work'],
            'team': ['.team', '#team', '.team-section'],
            'contact': ['.contact', '#contact', '.contact-section'],
            'footer': ['footer', '.footer', '#footer', '[role="contentinfo"]']
        }
        
        # Try to find each section type
        for section_type, selector_list in selectors.items():
            for selector in selector_list:
                try:
                    elements = await page.query_selector_all(selector)
                    if elements:
                        for element in elements[:1]:  # Take first match
                            is_visible = await element.is_visible()
                            if is_visible:
                                box = await element.bounding_box()
                                if box and box['height'] > 50:
                                    sections.append({
                                        'type': section_type,
                                        'selector': selector,
                                        'element': element,
                                        'box': box
                                    })
                                    break
                except:
                    continue
        
        # Also try to find sections by common class patterns
        generic_sections = await page.query_selector_all('section[class], div[class*="section"]')
        for element in generic_sections[:10]:  # Limit to first 10
            try:
                is_visible = await element.is_visible()
                if is_visible:
                    box = await element.bounding_box()
                    if box and box['height'] > 200:
                        # Check if this overlaps with existing sections
                        overlaps = any(self._boxes_overlap(box, s['box']) for s in sections)
                        if not overlaps:
                            class_name = await element.get_attribute('class') or ''
                            sections.append({
                                'type': self._infer_type_from_class(class_name),
                                'selector': f'.{class_name.split()[0]}' if class_name else 'section',
                                'element': element,
                                'box': box
                            })
            except:
                continue
        
        # Sort by vertical position
        sections.sort(key=lambda s: s['box']['y'])
        
        # Limit to 5-6 most important sections
        if len(sections) > 6:
            # Prioritize header, hero, and footer
            priority_sections = []
            other_sections = []
            
            for s in sections:
                if s['type'] in ['header', 'hero', 'footer']:
                    priority_sections.append(s)
                else:
                    other_sections.append(s)
            
            # Take priority sections plus best others
            sections = priority_sections + other_sections[:6-len(priority_sections)]
            sections.sort(key=lambda s: s['box']['y'])
        
        return sections
    
    def _boxes_overlap(self, box1: Dict, box2: Dict) -> bool:
        """Check if two bounding boxes overlap"""
        return not (box1['x'] + box1['width'] < box2['x'] or 
                    box2['x'] + box2['width'] < box1['x'] or
                    box1['y'] + box1['height'] < box2['y'] or
                    box2['y'] + box2['height'] < box1['y'])
    
    def _infer_type_from_class(self, class_name: str) -> str:
        """Infer section type from class name"""
        class_lower = class_name.lower()
        
        type_keywords = {
            'hero': ['hero', 'banner', 'jumbotron'],
            'features': ['features', 'services', 'benefits'],
            'about': ['about'],
            'portfolio': ['portfolio', 'projects', 'work', 'gallery'],
            'team': ['team', 'staff'],
            'testimonials': ['testimonial', 'review'],
            'contact': ['contact'],
            'cta': ['cta', 'call-to-action']
        }
        
        for section_type, keywords in type_keywords.items():
            if any(keyword in class_lower for keyword in keywords):
                return section_type
        
        return 'section'
    
    async def _capture_section(self, page: Page, section: Dict, output_dir: str, index: int) -> Optional[Dict]:
        """Capture a specific section"""
        try:
            element = section['element']
            
            # Scroll to element
            await element.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)  # Wait for scroll
            
            # Take screenshot
            filename = f"{section['type']}_{index:02d}.png"
            filepath = os.path.join(output_dir, filename)
            
            await element.screenshot(path=filepath)
            
            # Get text content for context
            text_content = await element.text_content()
            text_preview = ' '.join(text_content.split()[:20]) if text_content else ''
            
            return {
                'type': section['type'],
                'filename': filename,
                'selector': section['selector'],
                'box': section['box'],
                'text_preview': text_preview + '...' if len(text_preview) > 0 else ''
            }
            
        except Exception as e:
            print(f"    Failed to capture {section['type']}: {str(e)}")
            return None


async def capture_wehappers():
    """Capture sections from wehappers.org"""
    capture = LiveWebsiteCapture(headless=True)
    
    # Create output directory based on domain
    url = "https://wehappers.org/"
    domain = urlparse(url).netloc.replace('www.', '').replace('.', '_')
    output_dir = f"live_captures/{domain}"
    
    await capture.capture_website(url, output_dir)


async def main():
    """Main entry point"""
    import sys
    
    if len(sys.argv) > 1:
        url = sys.argv[1]
        output_dir = sys.argv[2] if len(sys.argv) > 2 else None
        
        if not output_dir:
            domain = urlparse(url).netloc.replace('www.', '').replace('.', '_')
            output_dir = f"live_captures/{domain}"
        
        capture = LiveWebsiteCapture(headless=True)
        await capture.capture_website(url, output_dir)
    else:
        # Default: capture wehappers
        await capture_wehappers()


if __name__ == "__main__":
    # For Python 3.7+
    try:
        asyncio.run(main())
    except AttributeError:
        # Python 3.6
        loop = asyncio.get_event_loop()
        loop.run_until_complete(main())