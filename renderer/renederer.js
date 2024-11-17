const fs = require('fs');
const path = require('path');

// Resolve file path relative to the project root
const filePath = path.join(__dirname, '/file.txt'); // Go one directory up to find file.txt

let unfocusedDuration = 0; // Tracks the duration of "Unfocused" state
const CHECK_INTERVAL = 1000; // Check every second
const NOTIFICATION_THRESHOLD = 10; // Threshold in seconds for "Unfocused"

// Function to show a notification
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
    }, 5000); // Notification will disappear after 5 seconds
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

            // Check if the value is "Unfocused"
            if (data.trim() === "Unfocused") {
                unfocusedDuration += CHECK_INTERVAL / 1000; // Increment duration
            } else {
                unfocusedDuration = 0; // Reset duration if not "Unfocused"
            }

            // Trigger notification if the duration exceeds the threshold
            if (unfocusedDuration >= NOTIFICATION_THRESHOLD) {
                showNotification("Alert: You have been unfocused for an extended period!");
                unfocusedDuration = 0; // Reset to avoid repeated notifications
            }
        }
    });
}

// Fetch data initially and then refresh periodically
fetchData();
setInterval(fetchData, CHECK_INTERVAL); // Refresh every second