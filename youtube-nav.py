import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
from tkinter import Tk  # To get screen dimensions dynamically

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--start-maximized")  # Start browser maximized
chrome_options.add_argument("--disable-notifications")  # Disable native pop-ups

# Path to your chromedriver executable
chromedriver_path = "/Users/nothimofc/Documents/Neuro-Stress-Monitor/chromedriver"  # Update this with your chromedriver path

# Initialize WebDriver
service = Service(chromedriver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Function to set browser position to occupy 50% of the right side of the screen
def set_browser_position(driver):
    # Get the screen width and height
    root = Tk()
    root.withdraw()  # Hide the Tkinter window
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()

    # Calculate window dimensions and position
    window_width = screen_width // 2  # 50% of the screen width
    window_height = screen_height  # Full screen height
    window_x = screen_width // 2  # Start at the middle of the screen (right side)
    window_y = 0  # Start at the top of the screen

    # Set the window size and position
    driver.set_window_rect(window_x, window_y, window_width, window_height)
    print(f"Browser positioned at x={window_x}, y={window_y}, width={window_width}, height={window_height}")

# Initialize counts
focused_count = 0
unfocused_count = 0

# Path to the `file.txt`
file_path = os.path.join(os.path.dirname(__file__), "renderer", "file.txt")

def show_browser_notification(driver, title, message):
    """
    Display a notification directly in the browser using the Notification API.
    Falls back to a custom modal if notifications are not supported or denied.
    Automatically closes the notification after 2 seconds.
    """
    # Ensure title and message are properly escaped for JavaScript
    import json
    title_js = json.dumps(title)
    message_js = json.dumps(message)

    script = f"""
    (function() {{
        function createCustomModal(title, message) {{
            // Check if the modal already exists
            if (document.getElementById('custom-modal')) {{
                document.getElementById('custom-modal').remove();
            }}

            // Create modal elements
            var modal = document.createElement('div');
            modal.id = 'custom-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';

            var modalContent = document.createElement('div');
            modalContent.style.backgroundColor = '#fff';
            modalContent.style.padding = '20px';
            modalContent.style.borderRadius = '5px';
            modalContent.style.textAlign = 'center';
            modalContent.style.maxWidth = '80%';

            var modalTitle = document.createElement('h2');
            modalTitle.innerText = title;

            var modalMessage = document.createElement('p');
            modalMessage.innerText = message;

            modalContent.appendChild(modalTitle);
            modalContent.appendChild(modalMessage);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Auto-close the modal after 2 seconds
            setTimeout(function() {{
                if (modal) {{
                    modal.remove();
                }}
            }}, 2000);
        }}

        if (typeof Notification !== "undefined") {{
            if (Notification.permission === "granted") {{
                var notification = new Notification({title_js}, {{
                    body: {message_js},
                    icon: "https://cdn-icons-png.flaticon.com/512/633/633600.png"
                }});
                setTimeout(function() {{ notification.close(); }}, 2000);
            }} else if (Notification.permission !== "denied") {{
                Notification.requestPermission().then(permission => {{
                    if (permission === "granted") {{
                        var notification = new Notification({title_js}, {{
                            body: {message_js},
                            icon: "https://cdn-icons-png.flaticon.com/512/633/633600.png"
                        }});
                        setTimeout(function() {{ notification.close(); }}, 2000);
                    }} else {{
                        createCustomModal({title_js}, {message_js});
                    }}
                }});
            }} else {{
                createCustomModal({title_js}, {message_js});
            }}
        }} else {{
            createCustomModal({title_js}, {message_js});
        }}
    }})();
    """
    driver.execute_script(script)

try:
    # Set browser position to 50% of the right side
    set_browser_position(driver)

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
