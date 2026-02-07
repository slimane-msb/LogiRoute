"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Map container not found");
        return;
    }
    // Initialize the map
    const map = L.map("map").setView([48.8566, 2.3522], 13); // Paris
    // OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
    }).addTo(map);
    // Test marker
    L.marker([48.8566, 2.3522])
        .addTo(map)
        .bindPopup("Leaflet is working 🚀")
        .openPopup();
    console.log("Leaflet map initialized");
});
