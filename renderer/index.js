import { io } from 'socket.io-client';


const socket = io.connect('http://localhost:5001');
console.log('WebSocket initialized.');


socket.on('connect', () => console.log('Connected to WebSocket server.'));
socket.on('arduino_data', (data) => {
    console.log('Data received:', data);
});