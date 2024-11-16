# import serial 
import time 
from flask import Flask
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import os 

load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
# arduino = serial.Serial(port='COM3', baudrate=115200, timeout=2) 

def write_read(): 
	# arduino.write(bytes(x, 'utf-8')) 
	# time.sleep(0.05) 
	while True:
		try:
			# data = arduino.readline() 
			data = 1
			if data:
				# output = int(data.decode('utf-8').strip())
				output = data
				socketio.emit('arduino_data', {'value': output})
				print(f"Sent: {output}")
			time.sleep(1)  # Add a delay between readings to avoid flooding
		except Exception as e:
			print(f"Error reading from Arduino: {e}")

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@app.route('/')
def index():
    return "Server is running"


@app.route('/start-server', methods=['POST'])
def start_server():
	return "Server started", 200

if __name__ == '__main__':
	socketio.start_background_task(target=write_read)
	socketio.run(app, host='0.0.0.0', port=5001)
