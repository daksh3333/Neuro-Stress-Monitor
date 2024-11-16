// import 'chartjs-adapter-date-fns';

// const canvasElement = document.getElementById('stressChart');
// const ctx = canvasElement.getContext('2d');

// // Threshold for stress
// let stressThreshold = 80;

// const stressChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: [],
//         datasets: [{
//             label: 'Brain Signals',
//             data: [],
//             borderColor: 'rgba(75, 192, 192, 1)',
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             borderWidth: 1,
//             tension: 0.1,
//         }],
//     },
//     options: {
//         plugins: {
//             annotation: {
//                 annotations: {
//                     thresholdLine: {
//                         type: 'line',
//                         yMin: stressThreshold,
//                         yMax: stressThreshold,
//                         borderColor: 'red',
//                         borderWidth: 2,
//                         label: {
//                             content: 'Stress Threshold',
//                             enabled: true,
//                             position: 'end',
//                         }
//                     }
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 type: 'time',
//                 time: {
//                     unit: 'second',
//                 },
//                 title: {
//                     display: true,
//                     text: 'Time',
//                 },
//             },
//             y: {
//                 beginAtZero: true,
//                 title: {
//                     display: true,
//                     text: 'Signal Intensity',
//                 },
//             },
//         },
//     },
// });

// function playAlertSound() {
//     const audio = new Audio('alert.mp3'); // Ensure alert.mp3 is in the project directory
//     audio.play();
// }

// function generateMockData() {
//     const timestamp = new Date();
//     const signalValue = Math.random() * 100;

//     if (signalValue > stressThreshold) {
//         showNotification(`Stress detected! Level: ${signalValue}`);
//         playAlertSound();
//     }

//     stressChart.data.labels.push(timestamp);
//     stressChart.data.datasets[0].data.push(signalValue);

//     if (stressChart.data.labels.length > 50) {
//         stressChart.data.labels.shift();
//         stressChart.data.datasets[0].data.shift();
//     }

//     stressChart.update();
// }

// // Simulate data updates
// setInterval(generateMockData, 1000);

const socket = io('http://localhost:5001');
console.log("Test")
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('arduino_data', function(data) {
    console.log('Received data:', data);
});
