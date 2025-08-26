#!/usr/bin/env python3
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
        
        print(f"\nCaptured {captured} sections in {output_dir}/")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_wehappers()
