const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process'); // Add this line

// Resolve file path relative to the project root
const filePath = path.join(__dirname, '/file.txt'); // Ensure file.txt is in the correct directory

// Create an audio element for the alert sound
const alertSound = new Audio(path.join(__dirname, '/alert.mp3'));

// Variables to track unfocused state duration
let unfocusedStartTime = null;
const unfocusedThreshold = 10000; // 10 seconds in milliseconds

// Quotes by David Goggins
const gogginsQuotes = [
    "Stay hard!",
    "You don't know me, son!",
    "It's not about winning, it's about being able to endure.",
    "Who's going to carry the boats?",
    "And the logs?",
    "Suffering is the true test of life.",
    "Be uncommon amongst uncommon people.",
];
let firstNotification = true; // Track if it's the first notification
let quoteIndex = 0; // To cycle through Goggins quotes

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;

    // Add the notification to the notification container
    const notificationContainer = document.getElementById('notification-container');
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000); // Notification disappears after 5 seconds

    // Play the alert sound
    alertSound.play();
}
// Function to execute Python scripts
function executePythonScript(scriptName) {
    const scriptPath = path.join(__dirname, '..', `${scriptName}-nav.py`);

    const pythonProcess = spawn('python', [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`${scriptName}-nav.py stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`${scriptName}-nav.py stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`${scriptName}-nav.py process exited with code ${code}`);
    });
}

// Add event listeners for the buttons
document.getElementById('youtube-btn').addEventListener('click', () => {
    executePythonScript('youtube');
});

document.getElementById('tiktok-btn').addEventListener('click', () => {
    executePythonScript('tiktok');
});
// Function to read and update the content of the file
function fetchData() {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            document.getElementById('state-header').innerText = 'Current State: Error loading data';
        } else {
            const trimmedData = data.trim();
            console.log('File data:', trimmedData);
            document.getElementById('state-header').innerText = `Current State: ${trimmedData}`;

            // Check for 'Unfocused' state
            if (trimmedData === 'Unfocused') {
                if (unfocusedStartTime === null) {
                    unfocusedStartTime = Date.now();
                } else if (Date.now() - unfocusedStartTime >= unfocusedThreshold) {
                    if (firstNotification) {
                        showNotification('You’ve been unfocused for a while. Take a break!');
                        firstNotification = false; // Disable first notification
                    } else {
                        // Show Goggins quote
                        showNotification(gogginsQuotes[quoteIndex]);
                        quoteIndex = (quoteIndex + 1) % gogginsQuotes.length; // Cycle through quotes
                    }
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
