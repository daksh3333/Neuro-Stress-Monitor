import { io } from 'socket.io-client';


const socket = io.connect('http://localhost:5002');
console.log('WebSocket initialized.');


socket.on('connect', () => console.log('Connected to WebSocket server.'));
socket.on('arduino_data', (data) => console.log('Data received:', data));
socket.on('connect_error', (err) => console.error('Connection error:', err));
socket.on('disconnect', () => console.warn('Disconnected from server.'));