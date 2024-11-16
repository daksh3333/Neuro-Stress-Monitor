import 'chartjs-adapter-date-fns';

// Get the canvas element for the chart
const canvasElement = document.getElementById('stressChart');
const ctx = canvasElement.getContext('2d');

// Threshold for stress
let stressThreshold = 80;

// Initialize the Chart.js chart
const stressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Timestamps
        datasets: [{
            label: 'Brain Signals',
            data: [], // Signal values
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            tension: 0.1,
        }],
    },
    options: {
        plugins: {
            annotation: {
                annotations: {
                    thresholdLine: {
                        type: 'line',
                        yMin: stressThreshold,
                        yMax: stressThreshold,
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: 'Stress Threshold',
                            enabled: true,
                            position: 'end',
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                },
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Signal Intensity',
                },
            },
        },
    },
});

// Function to show a notification when stress is detected
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
    }, 5000);
}

// Function to play an alert sound when stress is detected
function playAlertSound() {
    const audio = new Audio('alert.mp3'); // Ensure alert.mp3 is in the project directory
    audio.play();
}

// Connect to the Socket.IO server
const socket = io('http://localhost:5001');

// Log when connected to the server
socket.on('connect', function () {
    console.log('Connected to server');
});

// Receive data from the server and update the chart
socket.on('arduino_data', function (data) {
    console.log('Received data:', data);
    const signalValue = parseInt(data, 10); // Parse the signal value as an integer
    const timestamp = new Date(); // Get the current time for the x-axis

    // Add the signal value and timestamp to the chart
    stressChart.data.labels.push(timestamp);
    stressChart.data.datasets[0].data.push(signalValue);

    // Remove old data points to keep the chart manageable
    if (stressChart.data.labels.length > 50) {
        stressChart.data.labels.shift();
        stressChart.data.datasets[0].data.shift();
    }

    // Update the chart
    stressChart.update();

    // Trigger notification and sound if the signal exceeds the threshold
    if (signalValue > stressThreshold) {
        showNotification(`Stress detected! Level: ${signalValue}`);
        playAlertSound();
    }
});
