
// Initialize the map
const defaultCoordinates = [25.4358, 81.8463]; // Default center (Prayagraj)
const defaultZoomLevel = 13;

const map = L.map('map').setView(defaultCoordinates, defaultZoomLevel);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define custom icons
const vehicleIcon = L.icon({
    iconUrl: 'vehicle_icon.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const startIcon = L.icon({
    iconUrl: 'pin_point_icon.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const endIcon = L.icon({
    iconUrl: 'pin_point_icon.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

// Create a marker for the vehicle at default coordinates
let vehicleMarker = L.marker(defaultCoordinates, { icon: vehicleIcon }).addTo(map);

// Store route points
let startPoint = null;
let endPoint = null;
let routeLine = null;
let startMarker = null;
let endMarker = null;

// Move the vehicle to new coordinates
function moveVehicle(newLat, newLng) {
    const newCoordinates = [newLat, newLng];
    vehicleMarker.setLatLng(newCoordinates);
    map.panTo(newCoordinates);
}

// Handle map clicks to set start and end points
map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    if (!startPoint) {
        startPoint = [lat, lng];
        startMarker = L.marker(startPoint, { icon: startIcon }).addTo(map);
    } else if (!endPoint) {
        endPoint = [lat, lng];
        endMarker = L.marker(endPoint, { icon: endIcon }).addTo(map);
        
        // Draw the route between points
        if (routeLine) {
            map.removeLayer(routeLine);
        }
        routeLine = L.polyline([startPoint, endPoint], { color: 'blue' }).addTo(map);
        moveVehicleToRoute(startPoint, endPoint);
    }
});

// Function to move the vehicle between two points
function moveVehicleToRoute(start, end) {
    const duration = 5000; // Duration in milliseconds
    const frames = 60;
    const interval = duration / frames;
    let frame = 0;

    const latDiff = (end[0] - start[0]) / frames;
    const lngDiff = (end[1] - start[1]) / frames;

    const moveInterval = setInterval(() => {
        frame++;
        const newLat = start[0] + latDiff * frame;
        const newLng = start[1] + lngDiff * frame;
        vehicleMarker.setLatLng([newLat, newLng]);
        map.panTo([newLat, newLng]);

        if (frame >= frames) {
            clearInterval(moveInterval);
        }
    }, interval);
}

// Button event to move vehicle manually
document.getElementById('moveVehicleBtn').addEventListener('click', () => {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);
    
    if (!isNaN(lat) && !isNaN(lng)) {
        moveVehicle(lat, lng);
    } else {
        alert('Please enter valid latitude and longitude values.');
    }
});

// Reset the route
document.getElementById('resetRouteBtn').addEventListener('click', () => {
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    if (routeLine) map.removeLayer(routeLine);
    
    startPoint = null;
    endPoint = null;
    startMarker = null;
    endMarker = null;
    routeLine = null;
});
