import serial
import time
from flask import Flask
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Arduino connection setup
arduino_port = os.getenv("ARDUINO_PORT", "COM3")
baud_rate = int(os.getenv("BAUD_RATE", 115200))
timeout = float(os.getenv("ARDUINO_TIMEOUT", 2))
try:
    arduino = serial.Serial(port=arduino_port, baudrate=baud_rate, timeout=timeout)
    print(f"Connected to Arduino on {arduino_port}")
except Exception as e:
    print(f"Failed to connect to Arduino: {e}")
    arduino = None

def read_arduino_data():
    while True:
        try:
            if arduino and arduino.in_waiting > 0:
                data = arduino.readline().decode('utf-8').strip()
                if data.isdigit():
                    signal_value = int(data)
                    socketio.emit('arduino_data', signal_value)
                    print(f"Sent: {signal_value}")
            time.sleep(0.05)
        except Exception as e:
            print(f"Error reading Arduino: {e}")
            break

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@app.route('/')
def index():
    return "Server is running."

if __name__ == '__main__':
    socketio.start_background_task(read_arduino_data)
    socketio.run(app, host='0.0.0.0', port=5001)
