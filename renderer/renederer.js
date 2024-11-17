const fs = require('fs');
const path = require('path');

// Resolve file path relative to the project root
const filePath = path.join(__dirname, '/file.txt'); // Go one directory up to find file.txt

// Function to read and update the content of the file
function fetchData() {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            document.getElementById('content').innerText = 'Error loading data';
        } else {
            console.log('File data:', data);
            document.getElementById('content').innerText = data;
        }
    });
}

// Fetch data initially and then refresh periodically
fetchData();
setInterval(fetchData, 1000); // Refresh every second