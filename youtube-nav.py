import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--start-maximized")  # Start browser maximized
chrome_options.add_argument("--disable-notifications")  # Disable native pop-ups

# Path to your chromedriver executable
chromedriver_path = "/Users/nothimofc/Documents/Neuro-Stress-Monitor/chromedriver"  # Update this with your chromedriver path

# Initialize WebDriver
service = Service(chromedriver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Initialize counts
focused_count = 0
unfocused_count = 0

# Path to the `file.txt`
file_path = os.path.join(os.path.dirname(__file__), "renderer", "file.txt")

def show_browser_notification(driver, title, message):
    """
    Display a notification directly in the browser using the Notification API.
    """
    script = f"""
    if (Notification.permission === "granted") {{
        var notification = new Notification("{title}", {{
            body: "{message}",
            icon: "https://cdn-icons-png.flaticon.com/512/633/633600.png"
        }});
    }} else if (Notification.permission !== "denied") {{
        Notification.requestPermission().then(permission => {{
            if (permission === "granted") {{
                var notification = new Notification("{title}", {{
                    body: "{message}",
                    icon: "https://cdn-icons-png.flaticon.com/512/633/633600.png"
                }});
            }}
        }});
    }}
    """
    driver.execute_script(script)

try:
    # Step 1: Go to YouTube
    driver.get("https://www.youtube.com")
    print("Navigated to YouTube.")

    # Wait for the page to load
    time.sleep(5)

    # Step 2: Locate the Shorts button and click it
    try:
        shorts_button = driver.find_element(By.XPATH, '//a[@title="Shorts"]')

        # Highlight the Shorts button
        driver.execute_script("arguments[0].style.border='3px solid red'", shorts_button)
        print("Shorts button highlighted.")

        # Wait for 2 seconds
        time.sleep(2)

        # Click the Shorts button
        shorts_button.click()
        print("Shorts button clicked.")
    except Exception as e:
        print(f"Error locating or interacting with the Shorts button: {e}")
        driver.quit()
        exit()

    # Step 3: Wait 10 seconds on the Shorts page
    time.sleep(10)

    # Step 4: Locate the "Next video" button and interact
    try:
        next_video_button = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Next video']")

        # Highlight the Next video button
        driver.execute_script("arguments[0].style.border='3px solid red'", next_video_button)
        print("Next video button highlighted.")

        # Wait for 2 seconds
        time.sleep(2)

        # Click the Next video button
        next_video_button.click()
        print("Next video button clicked.")
    except Exception as e:
        print(f"Error locating or interacting with the Next video button: {e}")

    # Step 5: Monitor "file.txt" every 10 seconds
    while True:
        time.sleep(10)  # Wait for 10 seconds

        # Read the content of "file.txt"
        try:
            with open(file_path, "r") as f:
                status = f.read().strip()
                print(f"Status read from file.txt: {status}")
        except Exception as e:
            print(f"Error reading file.txt: {e}")
            continue  # Skip this iteration if file cannot be read

        if status == "Focused":
            focused_count += 1
            unfocused_count = 0  # Reset unfocused count
            if focused_count % 3 == 0:
                # Show congratulatory notification
                title = "Great Job!"
                message = "Congratulations! You are being focused. Keep up the pace!"
                show_browser_notification(driver, title, message)
        elif status == "Unfocused":
            unfocused_count += 1
            focused_count = 0  # Reset focused count
            if unfocused_count == 1:
                # Show warning notification
                title = "Attention!"
                message = "You are not focused. The video will be closed soon if you do not focus."
                show_browser_notification(driver, title, message)
            elif unfocused_count == 2:
                # Close the video/browser
                print("Second 'Unfocused' detected. Closing the browser.")
                break  # Exit the loop to close the browser
        else:
            print(f"Unrecognized status in file.txt: {status}")

finally:
    # Close the browser
    driver.quit()
    print("Browser closed.")
