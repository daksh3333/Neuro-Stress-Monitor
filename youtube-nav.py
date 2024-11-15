from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--start-maximized")  # Start browser maximized
chrome_options.add_argument("--disable-notifications")  # Disable pop-ups

# Path to your chromedriver executable
chromedriver_path = "/Users/nothimofc/Documents/Neuro-Stress-Monitor/chromedriver"  # Update this with your chromedriver path

# Initialize WebDriver
service = Service(chromedriver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

try:
    # Step 1: Go to YouTube
    driver.get("https://www.youtube.com")
    print("Navigated to YouTube.")

    # Wait for the page to load
    time.sleep(5)

    # Step 2: Locate the Shorts button and click it
    try:
        shorts_button = driver.find_element(By.XPATH, '//a[@title="Shorts"]')
        
        # Highlight the Shorts button by injecting JavaScript
        driver.execute_script("arguments[0].style.border='3px solid red'", shorts_button)
        print("Shorts button highlighted.")

        # Wait for 2 seconds to emphasize highlighting
        time.sleep(2)

        # Click the Shorts button
        shorts_button.click()
        print("Shorts button clicked.")
    except Exception as e:
        print(f"Error locating or interacting with the Shorts button: {e}")
        driver.quit()
        exit()

    # Step 3: Wait 10 seconds in the Shorts page
    time.sleep(10)

    # Step 4: Locate the "Next video" button and interact
    try:
        next_video_button = driver.find_element(By.CSS_SELECTOR, 
                                                "button[aria-label='Next video']")  # Locate using aria-label
        
        # Highlight the button by injecting JavaScript
        driver.execute_script("arguments[0].style.border='3px solid red'", next_video_button)
        print("Next video button highlighted.")

        # Wait for 2 seconds to emphasize highlighting
        time.sleep(2)

        # Click the Next video button
        next_video_button.click()
        print("Next video button clicked.")
    except Exception as e:
        print(f"Error locating or interacting with the Next video button: {e}")

    # Step 5: Stay on the Shorts page for 1 minute
    time.sleep(60)

finally:
    # Close the browser
    driver.quit()
    print("Browser closed.")
