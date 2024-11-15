const ctx = document.getElementById('stressChart').getContext('2d');

// Initialize the chart
const stressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Timestamps
        datasets: [{
            label: 'Brain Signals',
            data: [], // Stress signal values
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.1,
        }],
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Signal Intensity'
                }
            }
        }
    }
});

// Simulate data
function generateMockData() {
    const timestamp = new Date().toLocaleTimeString();
    const signalValue = Math.random() * 100; // Replace with actual range

    // Add new data
    stressChart.data.labels.push(timestamp);
    stressChart.data.datasets[0].data.push(signalValue);

    // Remove old data to keep the chart manageable
    if (stressChart.data.labels.length > 50) {
        stressChart.data.labels.shift();
        stressChart.data.datasets[0].data.shift();
    }

    // Update the chart
    stressChart.update();
}

// Simulate data every second
setInterval(generateMockData, 1000);
