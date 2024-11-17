import serial
import time
from flask import Flask
from flask_socketio import SocketIO


# Flask app setup
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


# Arduino setup
# Replace 'COM3' with the port where your Arduino is connected
try:
    arduino = serial.Serial(port='COM3', baudrate=115200, timeout=2)
    print("Connected to Arduino on COM3")
    use_arduino = True
except Exception as e:
    print(f"Arduino not found. Falling back to mock data. Error: {e}")
    use_arduino = False


# Function to read data from Arduino
def read_from_arduino():
    try:
        data = arduino.readline().decode('utf-8').strip()
        if data:
            return int(data)
    except Exception as e:
        print(f"Error reading from Arduino: {e}")
    return None


# Function to generate mock data
def generate_mock_data():
    import random
    return random.randint(50, 120)


# Background task for emitting data
def emit_data():
    while True:
        try:
            value = generate_mock_data()
            print(f"Emitting mock value: {value}")  # Debug log
            socketio.emit('arduino_data', {'value': value})
            time.sleep(0.5)
        except Exception as e:
            print(f"Error in emit_data loop: {e}")


# WebSocket events
@socketio.on('connect')
def handle_connect():
    print("Client connected")


# HTTP route (optional, for debugging)
@app.route('/')
def index():
    return "Stress Monitor Backend Running"


# Start the background task and run the server
if __name__ == '__main__':
    socketio.start_background_task(emit_data)
    socketio.run(app, host='0.0.0.0', port=5002)