
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // Ensure the port is not being used by another application

app.use(cors()); // Enable CORS for frontend requests

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the vehicle location data
let currentIndex = 0;
app.get('/vehicle-location', (req, res) => {
    fs.readFile('vehicle-data.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        const vehicleData = JSON.parse(data);
        const currentLocation = vehicleData[currentIndex];
        currentIndex = (currentIndex + 1) % vehicleData.length;

        res.json(currentLocation);
    });
});

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
