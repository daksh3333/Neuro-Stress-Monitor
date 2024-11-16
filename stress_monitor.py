import serial 
import time 
arduino = serial.Serial(port='COM3', baudrate=115200, timeout=2) 
def write_read(x): 
	# arduino.write(bytes(x, 'utf-8')) 
	# time.sleep(0.05) 
	data = arduino.readline() 
	return data 
while True: 
	num = 1 
	value = write_read(num)
	output = int(value.decode('utf-8').strip()) 
	print(output) # printing the output