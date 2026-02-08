// UI Components and Location Management

let locations = [];
let markers = [];
let visualizationLayers = [];
let isAddingLocation = false;
let isVisualizing = false;

function updateLocationsPanel() {
    const locationCount = document.getElementById('locationCount');
    const locationsList = document.getElementById('locationsList');
    const visualizeBtn = document.getElementById('visualizeBtn');

    locationCount.textContent = locations.length;
    locationsList.innerHTML = '';

    locations.forEach((loc, index) => {
        const item = document.createElement('div');
        item.className = 'location-item';
        
        const number = document.createElement('div');
        number.className = 'location-number';
        number.style.background = getMarkerColor(index, locations.length);
        number.textContent = index + 1;
        
        const coords = document.createElement('span');
        coords.textContent = `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'location-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = () => removeLocation(index);
        
        item.appendChild(number);
        item.appendChild(coords);
        item.appendChild(deleteBtn);
        locationsList.appendChild(item);
    });

    visualizeBtn.disabled = locations.length < 2;
}

function addLocation(latlng) {
    const location = { lat: latlng.lat, lng: latlng.lng };
    locations.push(location);

    const marker = L.marker([latlng.lat, latlng.lng], {
        icon: createMarkerIcon(getMarkerColor(locations.length - 1, locations.length), locations.length)
    }).addTo(getMap());

    markers.push(marker);
    updateLocationsPanel();
    updateAllMarkers();
    updateStatus(`Location ${locations.length} added. Add more or visualize.`);
}

function removeLocation(index) {
    locations.splice(index, 1);
    getMap().removeLayer(markers[index]);
    markers.splice(index, 1);
    updateAllMarkers();
    updateLocationsPanel();
    updateStatus(locations.length > 0 ? 'Location removed' : 'Add locations to start');
}

function updateAllMarkers() {
    markers.forEach((marker, index) => {
        marker.setIcon(createMarkerIcon(getMarkerColor(index, locations.length), index + 1));
    });
}

function clearVisualization() {
    visualizationLayers.forEach(layer => getMap().removeLayer(layer));
    visualizationLayers = [];
    
    const routeInfo = document.getElementById('routeInfo');
    routeInfo.style.display = 'none';
    
    updateStatus(locations.length >= 2 ? 'Ready to visualize' : 'Add at least 2 locations');
    document.getElementById('clearBtn').disabled = true;
}

function resetAll() {
    clearVisualization();
    markers.forEach(marker => getMap().removeLayer(marker));
    locations = [];
    markers = [];
    updateLocationsPanel();
    document.getElementById('visualizeBtn').disabled = true;
    updateStatus('Click "Add Location" to start');
}

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

function getLocations() {
    return locations;
}

function setLocations(newLocations) {
    locations = newLocations;
}

function getMarkers() {
    return markers;
}

function setMarkers(newMarkers) {
    markers = newMarkers;
}

function addVisualizationLayer(layer) {
    visualizationLayers.push(layer);
}

function getVisualizingState() {
    return isVisualizing;
}

function setVisualizingState(state) {
    isVisualizing = state;
}

function getAddingLocationState() {
    return isAddingLocation;
}

function setAddingLocationState(state) {
    isAddingLocation = state;
}

function getMarkerColor(index, total) {
    if (total === 1) return '#00ff00';
    const ratio = index / (total - 1);
    const r = Math.round(255 * ratio);
    const g = Math.round(255 * (1 - ratio));
    return `rgb(${r}, ${g}, 0)`;
}

function createMarkerIcon(color, label) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-icon" style="background: ${color};">${label}</div>`,
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5]
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}