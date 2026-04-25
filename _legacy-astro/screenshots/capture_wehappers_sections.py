#!/usr/bin/env python3
"""
Capture Wehappers.org Website Sections
Based on the actual structure of the website
"""

import os
import json
from pathlib import Path


def create_section_list():
    """Define the sections found on wehappers.org"""
    sections = [
        {
            "name": "header",
            "description": "Header with logo, navigation, and language selector",
            "selectors": ["header", ".header", "#header", "nav", ".navbar"],
            "expected_height": "80-150px"
        },
        {
            "name": "hero",
            "description": "Hero section: Re-imagining Wealth Distribution",
            "selectors": [".hero", ".hero-section", "section:first-of-type", "[class*='hero']"],
            "expected_height": "500-800px"
        },
        {
            "name": "happiness_index",
            "description": "World Happiness Index with interactive map",
            "selectors": ["[class*='happiness-index']", "[class*='map']", ".world-happiness"],
            "expected_height": "600-800px"
        },
        {
            "name": "wealth_stats",
            "description": "Wealth Discrepancies statistics",
            "selectors": ["[class*='wealth']", "[class*='statistics']", ".stats-section"],
            "expected_height": "400-600px"
        },
        {
            "name": "mission",
            "description": "Mission: Positively Impact Happiness",
            "selectors": ["[class*='mission']", ".mission-section", "#mission"],
            "expected_height": "400-600px"
        },
        {
            "name": "actions",
            "description": "Four key action areas/services",
            "selectors": ["[class*='action']", "[class*='services']", ".services-section"],
            "expected_height": "500-700px"
        },
        {
            "name": "dna_values",
            "description": "DNA/Values: core principles",
            "selectors": ["[class*='dna']", "[class*='values']", ".values-section"],
            "expected_height": "400-600px"
        },
        {
            "name": "personas",
            "description": "Happers Personas profiles",
            "selectors": ["[class*='personas']", "[class*='profiles']", ".personas-section"],
            "expected_height": "500-700px"
        },
        {
            "name": "process",
            "description": "Give what you can process diagram",
            "selectors": ["[class*='process']", ".process-section"],
            "expected_height": "400-600px"
        },
        {
            "name": "founders",
            "description": "Founders profiles",
            "selectors": ["[class*='founders']", "[class*='team']", ".team-section"],
            "expected_height": "600-800px"
        },
        {
            "name": "blog",
            "description": "Blog posts preview",
            "selectors": ["[class*='blog']", ".blog-section", "#blog"],
            "expected_height": "500-700px"
        },
        {
            "name": "community",
            "description": "Community partners and SDGs",
            "selectors": ["[class*='community']", "[class*='partners']", ".partners-section"],
            "expected_height": "300-500px"
        },
        {
            "name": "footer",
            "description": "Footer with navigation and social links",
            "selectors": ["footer", ".footer", "#footer"],
            "expected_height": "200-400px"
        }
    ]
    
    return sections


def save_section_guide():
    """Save a guide for capturing wehappers sections"""
    sections = create_section_list()
    
    output_dir = Path('live_captures/wehappers_org')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save section definitions
    with open(output_dir / 'sections_guide.json', 'w') as f:
        json.dump({
            'url': 'https://wehappers.org/en',
            'total_sections': len(sections),
            'sections': sections
        }, f, indent=2)
    
    # Create a manual capture guide
    guide = """# Wehappers.org Section Capture Guide

## Website URL: https://wehappers.org/en

## Sections to Capture:

1. **Header** - Navigation bar with logo and language selector
2. **Hero** - "Re-imagining Wealth Distribution" banner
3. **World Happiness Index** - Interactive map section
4. **Wealth Discrepancies** - Statistics graphics
5. **Mission** - "Positively Impact Happiness" section
6. **Actions/Services** - Four key action areas
7. **DNA/Values** - Core principles section
8. **Happers Personas** - Six persona profiles
9. **Process** - "Give what you can" diagram
10. **Founders** - Team profiles
11. **Blog** - Recent blog posts
12. **Community** - Partner logos and SDGs
13. **Footer** - Bottom navigation

## Recommended Tools:

1. **Browser Extension**: Full Page Screen Capture
   - Chrome: "GoFullPage"
   - Firefox: "FireShot"

2. **Manual Screenshots**:
   - Take screenshots of each section individually
   - Use browser developer tools to highlight sections

3. **Online Tools**:
   - https://www.screenshotmachine.com/
   - https://screenshot.guru/

## Expected Output:
- 5-6 key sections that best represent the website
- Focus on: Header, Hero, Mission/Services, Personas, Footer
"""
    
    with open(output_dir / 'capture_guide.md', 'w') as f:
        f.write(guide)
    
    print(f"Section guide saved to {output_dir}")
    print("\nKey sections identified:")
    for i, section in enumerate(sections[:6], 1):
        print(f"{i}. {section['name']}: {section['description']}")
    
    print(f"\nTotal sections found: {len(sections)}")
    print(f"Recommended to capture top 5-6 sections for best representation")


def create_selenium_script():
    """Create a Selenium script for automated capture"""
    script = '''#!/usr/bin/env python3
"""
Automated capture of Wehappers.org sections using Selenium
Requires: pip install selenium webdriver-manager pillow
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
from PIL import Image

def capture_wehappers():
    # Setup
    options = webdriver.ChromeOptions()
    options.add_argument('--window-size=1920,1080')
    
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    
    output_dir = "wehappers_captures"
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Load website
        print("Loading https://wehappers.org/en...")
        driver.get("https://wehappers.org/en")
        
        # Wait for page load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "header"))
        )
        time.sleep(3)
        
        # Capture full page first
        driver.save_screenshot(os.path.join(output_dir, "full_page.png"))
        
        # Priority sections to capture
        sections = [
            ("header", ["header", "nav", ".navbar"]),
            ("hero", [".hero", "[class*='hero']", "section:first-of-type"]),
            ("mission", ["[class*='mission']", "#mission"]),
            ("services", ["[class*='action']", "[class*='services']"]),
            ("personas", ["[class*='personas']", "[class*='profiles']"]),
            ("footer", ["footer", ".footer"])
        ]
        
        captured = 0
        for name, selectors in sections:
            for selector in selectors:
                try:
                    element = driver.find_element(By.CSS_SELECTOR, selector)
                    if element.is_displayed():
                        # Scroll to element
                        driver.execute_script(
                            "arguments[0].scrollIntoView({block: 'center'});", 
                            element
                        )
                        time.sleep(1)
                        
                        # Capture
                        filename = f"{name}_{captured+1:02d}.png"
                        element.screenshot(os.path.join(output_dir, filename))
                        print(f"Captured {name}")
                        captured += 1
                        break
                except:
                    continue
        
        print(f"\\nCaptured {captured} sections in {output_dir}/")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_wehappers()
'''
    
    output_dir = Path('live_captures/wehappers_org')
    script_path = output_dir / 'selenium_capture.py'
    
    with open(script_path, 'w') as f:
        f.write(script)
    
    print(f"\nSelenium script created: {script_path}")


if __name__ == "__main__":
    print("Analyzing Wehappers.org structure...")
    save_section_guide()
    create_selenium_script()
    
    print("\n" + "="*50)
    print("NEXT STEPS:")
    print("1. Review the section guide in: live_captures/wehappers_org/")
    print("2. Use the Selenium script or manual capture methods")
    print("3. Focus on capturing these 5 key sections:")
    print("   - Header (navigation)")
    print("   - Hero (main message)")  
    print("   - Mission/Services")
    print("   - Personas or Process")
    print("   - Footer")
    print("="*50)