import 'chartjs-adapter-date-fns';

// Establish WebSocket connection
const socket = io('http://localhost:5001');

// Initialize Chart.js chart
const canvasElement = document.getElementById('stressChart');
const ctx = canvasElement.getContext('2d');

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
        scales: {
            x: {
                type: 'time',
                time: { unit: 'second' },
                title: { display: true, text: 'Time' },
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Signal Intensity' },
            },
        },
    },
});

// Listen for data from WebSocket
socket.on('arduino-data', (data) => {
    console.log('Received data:', data);
    const signalValue = parseInt(data, 10); // Parse as integer
    if (!isNaN(signalValue)) {
        // Add to chart
        stressChart.data.labels.push(new Date());
        stressChart.data.datasets[0].data.push(signalValue);

        // Limit to 50 data points for performance
        if (stressChart.data.labels.length > 50) {
            stressChart.data.labels.shift();
            stressChart.data.datasets[0].data.shift();
        }

        stressChart.update();
    } else {
        console.error('Invalid data received:', data);
    }
});