import 'chartjs-adapter-date-fns';

console.log("Initializing chart...");
const canvasElement = document.getElementById('stressChart');
console.log("Canvas element found:", canvasElement);

if (!canvasElement) {
    console.error("Canvas element with ID 'stressChart' not found.");
    throw new Error("Canvas element missing.");
}

const ctx = canvasElement.getContext('2d');
console.log("Canvas context initialized:", ctx);

const stressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Brain Signals',
            data: [],
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
console.log("Chart initialized:", stressChart);

function generateMockData() {
    const timestamp = new Date();
    const signalValue = Math.random() * 100;

    console.log("Adding data point:", { timestamp, signalValue });

    stressChart.data.labels.push(timestamp);
    stressChart.data.datasets[0].data.push(signalValue);

    if (stressChart.data.labels.length > 50) {
        stressChart.data.labels.shift();
        stressChart.data.datasets[0].data.shift();
    }

    stressChart.update();
}

for (let i = 0; i < 10; i++) {
    const timestamp = new Date(Date.now() - (10 - i) * 1000);
    const signalValue = Math.random() * 100;
    stressChart.data.labels.push(timestamp);
    stressChart.data.datasets[0].data.push(signalValue);
    console.log("Initial data point added:", { timestamp, signalValue });
}

setInterval(generateMockData, 1000);
