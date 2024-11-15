#Core logic for handling data input, managing API connections, and processing stress signals. This file will contain the main application code for API endpoints and data handling.
from stress_monitor import detect_stress
from database import Database
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the database connection
db = Database(os.getenv('DATABASE_URL'))

def main():
    # Main loop for detecting stress and sending notifications
    while True:
        stress_level = detect_stress()
        if stress_level > THRESHOLD:
            # Send a notification or suggestion for a stress-relief activity
            print("Stress detected. Take a break or try a quick mindfulness activity.")
            db.save_stress_event(stress_level)

if __name__ == "__main__":
    main()