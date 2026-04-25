#!/usr/bin/env python3
"""
Fetch and analyze wehappers.org structure
"""

import urllib.request
import urllib.parse
import json
import re
from pathlib import Path


def fetch_website_structure(url):
    """Fetch website and analyze its structure"""
    print(f"Fetching {url}...")
    
    try:
        # Fetch the page
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        print(f"Fetched {len(html)} bytes")
        
        # Basic HTML structure analysis
        sections = analyze_html_structure(html)
        
        # Save analysis
        output_dir = Path('live_captures/wehappers_org')
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Save HTML for reference
        with open(output_dir / 'page.html', 'w') as f:
            f.write(html)
        
        # Save structure analysis
        with open(output_dir / 'structure.json', 'w') as f:
            json.dump(sections, f, indent=2)
        
        print(f"\nFound {len(sections)} major sections:")
        for section in sections:
            print(f"  - {section['type']}: {section['description']}")
        
        print(f"\nStructure saved to {output_dir}")
        
        # Create a script to capture these sections
        create_capture_script(url, sections, output_dir)
        
        return sections
        
    except Exception as e:
        print(f"Error fetching website: {str(e)}")
        return []


def analyze_html_structure(html):
    """Analyze HTML to find major sections"""
    sections = []
    
    # Common section patterns
    patterns = [
        # Header patterns
        (r'<header[^>]*>(.*?)</header>', 'header', 'Website header'),
        (r'<nav[^>]*>(.*?)</nav>', 'navigation', 'Navigation menu'),
        
        # Section patterns
        (r'<section[^>]*class=["\'][^"\']*hero[^"\']*["\'][^>]*>', 'hero', 'Hero/banner section'),
        (r'<section[^>]*class=["\'][^"\']*features[^"\']*["\'][^>]*>', 'features', 'Features section'),
        (r'<section[^>]*class=["\'][^"\']*about[^"\']*["\'][^>]*>', 'about', 'About section'),
        (r'<section[^>]*class=["\'][^"\']*services[^"\']*["\'][^>]*>', 'services', 'Services section'),
        (r'<section[^>]*class=["\'][^"\']*portfolio[^"\']*["\'][^>]*>', 'portfolio', 'Portfolio section'),
        (r'<section[^>]*class=["\'][^"\']*team[^"\']*["\'][^>]*>', 'team', 'Team section'),
        (r'<section[^>]*class=["\'][^"\']*contact[^"\']*["\'][^>]*>', 'contact', 'Contact section'),
        
        # Footer
        (r'<footer[^>]*>(.*?)</footer>', 'footer', 'Website footer'),
    ]
    
    for pattern, section_type, description in patterns:
        matches = re.findall(pattern, html, re.IGNORECASE | re.DOTALL)
        if matches:
            sections.append({
                'type': section_type,
                'description': description,
                'found': True,
                'count': len(matches)
            })
    
    # Also find generic sections
    section_matches = re.findall(r'<section[^>]*>', html, re.IGNORECASE)
    if section_matches:
        sections.append({
            'type': 'sections',
            'description': f'Found {len(section_matches)} section tags',
            'found': True,
            'count': len(section_matches)
        })
    
    # Find divs with section-like classes
    div_sections = re.findall(r'<div[^>]*class=["\'][^"\']*section[^"\']*["\'][^>]*>', html, re.IGNORECASE)
    if div_sections:
        sections.append({
            'type': 'div_sections',
            'description': f'Found {len(div_sections)} divs with section classes',
            'found': True,
            'count': len(div_sections)
        })
    
    return sections


def create_capture_script(url, sections, output_dir):
    """Create a script to capture the sections using browser automation"""
    script = f'''#!/usr/bin/env python3
"""
Auto-generated script to capture sections from {url}
Based on HTML structure analysis
"""

# This script requires selenium or playwright to be installed
# pip install selenium webdriver-manager

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import os

def capture_wehappers_sections():
    """Capture sections using Selenium"""
    
    # Setup Chrome driver
    options = webdriver.ChromeOptions()
    options.add_argument('--window-size=1920,1080')
    # options.add_argument('--headless')  # Uncomment for headless mode
    
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    
    try:
        # Load the website
        print("Loading {url}...")
        driver.get("{url}")
        time.sleep(3)  # Wait for page to load
        
        # Create output directory
        output_dir = "{output_dir}/selenium_captures"
        os.makedirs(output_dir, exist_ok=True)
        
        # Capture full page
        driver.save_screenshot(os.path.join(output_dir, "full_page.png"))
        print("Captured full page")
        
        # Try to capture specific sections
        selectors = [
            ("header", "Website header"),
            ("nav", "Navigation"),
            (".hero", "Hero section"),
            (".features", "Features section"),
            (".about", "About section"),
            (".services", "Services section"),
            (".portfolio", "Portfolio section"),
            (".contact", "Contact section"),
            ("footer", "Footer")
        ]
        
        captured = 0
        for selector, description in selectors:
            try:
                element = driver.find_element(By.CSS_SELECTOR, selector)
                if element.is_displayed():
                    # Scroll to element
                    driver.execute_script("arguments[0].scrollIntoView(true);", element)
                    time.sleep(0.5)
                    
                    # Take screenshot
                    filename = f"{{selector.replace('.', '').replace('#', '')}}_{captured+1:02d}.png"
                    element.screenshot(os.path.join(output_dir, filename))
                    print(f"Captured {{description}}")
                    captured += 1
            except:
                pass
        
        print(f"\\nCaptured {{captured}} sections")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_wehappers_sections()
'''
    
    script_path = output_dir / 'capture_sections.py'
    with open(script_path, 'w') as f:
        f.write(script)
    
    print(f"\nCreated capture script: {script_path}")
    print("To use it:")
    print("  1. Install selenium: pip install selenium webdriver-manager")
    print("  2. Run: python3 capture_sections.py")


if __name__ == "__main__":
    # Fetch and analyze wehappers.org
    fetch_website_structure("https://wehappers.org/")