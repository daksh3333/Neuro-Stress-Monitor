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
    Falls back to `alert` if notifications are not supported or denied.
    """
    script = f"""
    if (typeof Notification !== "undefined") {{
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
                }} else {{
                    alert("{title}: {message}");
                }}
            }});
        }} else {{
            alert("{title}: {message}");
        }}
    }} else {{
        alert("{title}: {message}");
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

    # Step 3: Monitor "file.txt" every 10 seconds
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
            if focused_count % 2 == 0:  # Trigger every 2nd "Focused"
                # Show congratulatory notification
                title = "Great Job!"
                message = "Congratulations! You are being focused. Keep up the pace!"
                show_browser_notification(driver, title, message)

        elif status == "Unfocused":
            unfocused_count += 1
            focused_count = 0  # Reset focused count

            if unfocused_count == 1:
                # First "Unfocused": Click the Next video button
                try:
                    next_video_button = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Next video']")
                    next_video_button.click()
                    print("Next video button clicked.")
                except Exception as e:
                    print(f"Error locating or interacting with the Next video button: {e}")
            elif unfocused_count == 2:
                # Second "Unfocused": Show a warning notification
                title = "Attention!"
                message = "You are not focused. Please refocus or the session will end soon."
                show_browser_notification(driver, title, message)
            elif unfocused_count == 3:
                # Third "Unfocused": Show a final notification and close the browser
                title = "Session Ended"
                message = "You are not focused. Take a 5-10 minute break to re-energize!"
                show_browser_notification(driver, title, message)
                print("Closing the browser in 3 seconds.")
                time.sleep(3)  # Wait before closing
                break  # Exit the loop to close the browser

        else:
            print(f"Unrecognized status in file.txt: {status}")

finally:
    # Close the browser
    driver.quit()
    print("Browser closed.")
