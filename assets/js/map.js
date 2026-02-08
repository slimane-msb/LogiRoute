// Map and Road Network Functions

let map;
let roadGraph = null;

function initializeMap() {
    map = L.map('map').setView([48.8566, 2.3522], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    return map;
}

function getMap() {
    return map;
}

function getRoadGraph() {
    return roadGraph;
}

function setRoadGraph(graph) {
    roadGraph = graph;
}