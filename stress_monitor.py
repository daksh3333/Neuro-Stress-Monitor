from muselsl import stream, list_muses
import numpy as np
import time

def detect_stress():
    """
    Connects to the Muse headband, streams EEG data, and calculates stress levels.
    """
    # List available Muse devices
    muses = list_muses()
    if muses:
        print(f"Connecting to Muse: {muses[0]['name']}")
        
        # Start streaming from the first available Muse device
        stream(address=muses[0]['address'])

        # Wait a few seconds for data collection to stabilize
        time.sleep(5)

        # Placeholder for EEG data processing
        # In reality, you would collect EEG data samples for analysis here
        # For demonstration purposes, simulate brainwave ratios
        alpha = np.random.uniform(0.5, 1.5)  # Simulated alpha brainwave value
        beta = np.random.uniform(0.1, 0.8)  # Simulated beta brainwave value
        
        if alpha != 0:
            # Stress level as the ratio of beta to alpha waves
            stress_level = beta / alpha
        else:
            stress_level = 0

        # Print stress level (for debugging)
        print(f"Detected stress level: {stress_level}")

        return stress_level
    else:
        print("No Muse devices found.")
        return 0  # Default value if no Muse device is available
