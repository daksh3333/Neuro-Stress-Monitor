const fs = require('fs');
const path = require('path');

// Resolve file path relative to the project root
const filePath = path.join(__dirname, '/file.txt'); // Go one directory up to find file.txt

// Create an audio element for the alert sound
const alertSound = new Audio(path.join(__dirname, '/alert.mp3'));

// Variables to track unfocused state duration
let unfocusedStartTime = null;
const unfocusedThreshold = 10000; // 10 seconds in milliseconds

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'red';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000); // Notification disappears after 5 seconds

    // Play the alert sound
    alertSound.play();
}

// Function to read and update the content of the file
function fetchData() {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            document.getElementById('content').innerText = 'Error loading data';
        } else {
            console.log('File data:', data);
            document.getElementById('content').innerText = data;

            // Check for 'Unfocused' state
            if (data.trim() === 'Unfocused') {
                if (unfocusedStartTime === null) {
                    unfocusedStartTime = Date.now();
                } else if (Date.now() - unfocusedStartTime >= unfocusedThreshold) {
                    showNotification('You’ve been unfocused for a while. Take a break!');
                    unfocusedStartTime = null; // Reset after notification
                }
            } else {
                unfocusedStartTime = null; // Reset if not 'Unfocused'
            }
        }
    });
}

// Fetch data initially and then refresh periodically
fetchData();
setInterval(fetchData, 1000); // Refresh every second
