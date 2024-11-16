import 'chartjs-adapter-date-fns';

const ctx = document.getElementById('stressChart').getContext('2d');

const stressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // This will hold time-based labels (timestamps)
        datasets: [{
            label: 'Brain Signals',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.1,
        }],
    },
    options: {
        scales: {
            x: {
                type: 'time',  // Time-based scale
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

// Simulate mock data for testing
function generateMockData() {
    const timestamp = new Date();  // Create a timestamp using current date and time
    const signalValue = Math.random() * 100;

    // Push the timestamp and signal value to the chart
    stressChart.data.labels.push(timestamp);
    stressChart.data.datasets[0].data.push(signalValue);

    // Keep the chart manageable (limit the number of data points)
    if (stressChart.data.labels.length > 50) {
        stressChart.data.labels.shift();
        stressChart.data.datasets[0].data.shift();
    }

    // Update the chart
    stressChart.update();
}

setInterval(generateMockData, 1000);  // Generate mock data every second
