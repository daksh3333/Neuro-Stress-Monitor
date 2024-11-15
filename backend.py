#Core logic for handling data input, managing API connections, and processing stress signals. This file will contain the main application code for API endpoints and data handling.
from stress_monitor import detect_stress
from database import Database
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define threshold for stress detection
THRESHOLD = 0.7

# Initialize the database connection
db = Database(os.getenv('DATABASE_URL'))

def main():
    try:
        while True:
            stress_level = detect_stress()
            if stress_level > THRESHOLD:
                print("Stress detected. Take a break or try a quick mindfulness activity.")
                db.save_stress_event(stress_level)
            time.sleep(10)  # Check every 10 seconds
    except KeyboardInterrupt:
        print("Shutting down stress detection...")

if __name__ == "__main__":
    main()
