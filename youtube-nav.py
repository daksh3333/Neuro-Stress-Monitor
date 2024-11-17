from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import os

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--start-maximized")  # Start browser maximized
chrome_options.add_argument("--disable-notifications")  # Disable pop-ups

# Path to your chromedriver executable
chromedriver_path = "/Users/nothimofc/Documents/Neuro-Stress-Monitor/chromedriver"  # Update this with your chromedriver path

# Initialize WebDriver
service = Service(chromedriver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Initialize counts
focused_count = 0
unfocused_count = 0

def show_message_and_sound(driver, message, sound_url=None):
    script = f'''
    // Create the message overlay
    var messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '20px';
    messageDiv.style.padding = '15px';
    messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    messageDiv.style.color = 'white';
    messageDiv.style.fontSize = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.borderRadius = '5px';
    messageDiv.innerText = "{message}";
    document.body.appendChild(messageDiv);

    // Remove the message after 5 seconds
    setTimeout(function() {{
        document.body.removeChild(messageDiv);
    }}, 5000);

    // Play sound if provided
    {f"""
    var audio = new Audio('{sound_url}');
    audio.play();
    """ if sound_url else ''}
    '''
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
        next_video_button = driver.find_element(By.CSS_SELECTOR,
                                                "button[aria-label='Next video']")  # Locate using aria-label

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
            with open("file.txt", "r") as f:
                status = f.read().strip()
                print(f"Status read from file.txt: {status}")
        except Exception as e:
            print(f"Error reading file.txt: {e}")
            continue  # Skip this iteration if file cannot be read

        if status == "Focused":
            focused_count += 1
            unfocused_count = 0  # Reset unfocused count
            if focused_count % 3 == 0:
                # Show congratulatory message
                message = "Congratulations! You are being focused. Keep up the pace!"
                print(message)
                show_message_and_sound(driver, message)
        elif status == "Unfocused":
            unfocused_count += 1
            focused_count = 0  # Reset focused count
            if unfocused_count == 1:
                # Show warning notification with sound
                message = "You are not focused. The video will be closed soon if you do not focus."
                print(message)
                sound_url = 'https://www.myinstants.com/media/sounds/bell.mp3'  # Replace with a valid sound URL if needed
                show_message_and_sound(driver, message, sound_url)
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
