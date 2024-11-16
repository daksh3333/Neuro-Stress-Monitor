import 'chartjs-adapter-date-fns';

// Initialize global variables
let stressThreshold = 80; // Default threshold (updated dynamically)
const canvasElement = document.getElementById('stressChart'); // Chart canvas element
const ctx = canvasElement.getContext('2d'); // Canvas rendering context

// Initialize the Chart.js chart
const stressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // X-axis timestamps
        datasets: [{
            label: 'Brain Signals',
            data: [], // Y-axis signal values
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            tension: 0.2, // Slight smoothing of the line
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
                            content: `Stress Threshold: ${stressThreshold}`,
                            enabled: true,
                            position: 'end',
                            backgroundColor: 'rgba(255,0,0,0.1)', // Subtle background for visibility
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
                    displayFormats: {
                        second: 'HH:mm:ss', // Format for better clarity
                    },
                },
                title: {
                    display: true,
                    text: 'Time',
                    color: '#FFFFFF',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Signal Intensity',
                    color: '#FFFFFF',
                },
            },
        },
    },
});

// Function to update the stress threshold dynamically
function updateStressThreshold(newThreshold) {
    stressThreshold = newThreshold;

    // Update the chart's annotation to reflect the new threshold
    stressChart.options.plugins.annotation.annotations.thresholdLine.yMin = newThreshold;
    stressChart.options.plugins.annotation.annotations.thresholdLine.yMax = newThreshold;
    stressChart.options.plugins.annotation.annotations.thresholdLine.label.content = `Stress Threshold: ${newThreshold}`;
    stressChart.update();
}

// Function to show a notification when stress is detected
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'red',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        fontWeight: 'bold',
        zIndex: 1000,
    });

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000); // Remove notification after 5 seconds
}

// Function to play a sound alert
function playAlertSound() {
    const audio = new Audio('alert.mp3'); // Ensure alert.mp3 is in the same directory
    audio.play();
}

// Listen for Arduino data via ipcRenderer
window.ipcRenderer.on('arduino-data', (event, data) => {
    console.log('Received data:', data);

    const signalValue = parseInt(data, 10);
    if (isNaN(signalValue)) {
        console.error("Invalid data received:", data);
        return;
    }

    const timestamp = new Date(); // Current timestamp

    // Update the chart with new data
    stressChart.data.labels.push(timestamp);
    stressChart.data.datasets[0].data.push(signalValue);

    // Keep the chart manageable by removing old data
    if (stressChart.data.labels.length > 50) {
        stressChart.data.labels.shift();
        stressChart.data.datasets[0].data.shift();
    }

    // Refresh the chart
    stressChart.update();

    // Trigger alerts automatically if the signal exceeds the threshold
    if (signalValue > stressThreshold) {
        showNotification(`Stress detected! Level: ${signalValue}`);
        playAlertSound();
    }
});

// Listen for threshold updates via ipcRenderer
window.ipcRenderer.on('update-threshold', (event, threshold) => {
    console.log('Updated stress threshold:', threshold);
    updateStressThreshold(threshold);
});
