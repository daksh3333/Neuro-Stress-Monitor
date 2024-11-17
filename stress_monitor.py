import serial
import numpy as np
from scipy.signal import butter, filtfilt
import time

# Serial connection
arduino = serial.Serial(port='COM3', baudrate=115200, timeout=2)

# Constants
SAMPLE_RATE = 512  # Hz
BUFFER_SIZE = SAMPLE_RATE  # 1-second buffer
BETA_LOW = 14  # Hz
BETA_HIGH = 40  # Hz
CHECK_INTERVAL = 10  # Seconds for output interval
MIN_TRUE_PERCENTAGE = 0.1  # Minimum percentage of True signals to output True

# Butterworth bandpass filter for beta waves
def butter_bandpass(lowcut, highcut, fs, order=4):
    nyquist = 0.5 * fs
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = butter(order, [low, high], btype='band')
    return b, a

def bandpass_filter(data, lowcut, highcut, fs, order=4):
    b, a = butter_bandpass(lowcut, highcut, fs, order=order)
    return filtfilt(b, a, data)

# Determine if stressed based on beta wave power
def is_brain_in_beta_region(data, lowcut, highcut, fs, threshold=0.5):
    filtered_data = bandpass_filter(data, lowcut, highcut, fs)
    power = np.mean(np.square(filtered_data))  # Compute signal power
    return power >= threshold  # True if power is above threshold (in beta region)

# Buffers for storing data and results
data_buffer = []
unfocused_results = []

print("Monitoring brain waves...")

# Track time for 10-second intervals
start_time = time.time()

while True:
    try:
        # Read raw data from Arduino
        raw_data = arduino.readline().decode('utf-8').strip()
        
        # Check for valid data
        if not raw_data.isdigit():
            continue  # Skip invalid data
        
        sensor_value = int(raw_data)
        
        # Append data to the buffer
        data_buffer.append(sensor_value)

        # Keep buffer size fixed
        if len(data_buffer) > BUFFER_SIZE:
            data_buffer.pop(0)

        # Process data when buffer is full
        if len(data_buffer) == BUFFER_SIZE:
            # Convert buffer to numpy array
            data = np.array(data_buffer)

            # Check if brain waves are in beta region
            is_unfocused = not is_brain_in_beta_region(data, BETA_LOW, BETA_HIGH, SAMPLE_RATE)
            
            # Append result to the unfocused results buffer
            unfocused_results.append(is_unfocused)

        # Check every 10 seconds
        if time.time() - start_time >= CHECK_INTERVAL:
            # Calculate the percentage of True values in unfocused_results
            true_percentage = sum(unfocused_results) / len(unfocused_results) if unfocused_results else 0

            # Determine if unfocused based on the threshold
            output_result = true_percentage >= MIN_TRUE_PERCENTAGE
            print(f"Is Unfocused: {output_result} (True Percentage: {true_percentage:.2%})")

            # Reset for the next interval
            unfocused_results = []
            start_time = time.time()

    except KeyboardInterrupt:
        print("Exiting...")
        break
    except Exception as e:
        print(f"Error: {e}")

