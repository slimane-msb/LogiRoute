// Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
});

function setupEventListeners() {
    const addLocationBtn = document.getElementById('addLocationBtn');
    const visualizeBtn = document.getElementById('visualizeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resetBtn = document.getElementById('resetBtn');

    addLocationBtn.addEventListener('click', () => {
        setAddingLocationState(true);
        addLocationBtn.classList.add('active');
        updateStatus('Click on the map to add a location');
        getMap().getContainer().style.cursor = 'crosshair';
    });

    getMap().on('click', (e) => {
        if (!getAddingLocationState()) return;
        addLocation(e.latlng);
        setAddingLocationState(false);
        addLocationBtn.classList.remove('active');
        getMap().getContainer().style.cursor = '';
    });

    visualizeBtn.addEventListener('click', visualizePath);
    clearBtn.addEventListener('click', clearVisualization);
    resetBtn.addEventListener('click', resetAll);
}

async function visualizePath() {
    if (getVisualizingState() || getLocations().length < 2) return;
    
    setVisualizingState(true);
    document.getElementById('visualizeBtn').disabled = true;
    document.getElementById('clearBtn').disabled = true;

    clearVisualization();

    try {
        updateStatus('Loading city graph...');
        const graph = await load_city_graph('paris'); // Change to 'dublin' if needed (TODO)

        // Find nearest nodes for all locations
        updateStatus('Finding nearest road nodes...');
        const targetNodes = getLocations().map(loc => 
            findNearestNode(loc, graph.nodes)
        );

        if (targetNodes.some(node => !node)) {
            updateStatus('Error: Could not find road network nearby');
            setVisualizingState(false);
            document.getElementById('visualizeBtn').disabled = false;
            return;
        }

        // Run TSP to get optimal order
        updateStatus('Optimizing route order...');
        const tspResult = await bestTSP(graph, targetNodes);
        
        // Reorder locations and markers based on TSP result
        const nodeToLocationIndex = new Map();
        targetNodes.forEach((node, idx) => nodeToLocationIndex.set(node, idx));
        
        const reorderedLocations = tspResult.order.map(nodeId => {
            const idx = targetNodes.findIndex(n => n === nodeId);
            return getLocations()[idx];
        });
        const reorderedMarkers = tspResult.order.map(nodeId => {
            const idx = targetNodes.findIndex(n => n === nodeId);
            return getMarkers()[idx];
        });
        
        setLocations(reorderedLocations);
        setMarkers(reorderedMarkers);
        updateAllMarkers();
        updateLocationsPanel();

        // Visualize the path
        updateStatus('Drawing optimal route...');
        await animatePath(tspResult.path, graph);

        // Display results
        displayRouteInfo(tspResult.distance);

    } catch (error) {
        console.error('Error:', error);
        updateStatus('Error: ' + error.message);
    }

    setVisualizingState(false);
    document.getElementById('clearBtn').disabled = false;
    document.getElementById('visualizeBtn').disabled = false;
}

async function animatePath(path, graph) {
    const pathCoords = path
        .map(nodeId => graph.nodes[nodeId])
        .filter(node => node)
        .map(node => [node.lat, node.lng]);

    if (pathCoords.length < 2) return;

    // Draw full path
    const pathLine = L.polyline(pathCoords, {
        color: '#9c27b0',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round'
    }).addTo(getMap());

    addVisualizationLayer(pathLine);

    // Add direction arrows
    const numArrows = Math.min(5, Math.floor(pathCoords.length / 10));
    for (let i = 1; i <= numArrows; i++) {
        const idx = Math.floor((pathCoords.length * i) / (numArrows + 1));
        if (idx < pathCoords.length) {
            const arrow = L.marker(pathCoords[idx], {
                icon: L.divIcon({
                    className: 'arrow-icon',
                    html: '→',
                    iconSize: [20, 20]
                })
            }).addTo(getMap());
            addVisualizationLayer(arrow);
        }
    }
}

function displayRouteInfo(totalDistance) {
    const routeInfo = document.getElementById('routeInfo');
    const distanceKm = (totalDistance / 1000).toFixed(2);
    const algorithmSelect = document.getElementById('algorithmShortestPathSelect');
    const tspSelect = document.getElementById('algorithmTSPSelect');

    routeInfo.innerHTML = `
        <div><strong>Route Complete!</strong></div>
        <div>📍 Stops: ${getLocations().length}</div>
        <div>📏 Distance: ~${distanceKm} km</div>
        <div>🧮 Path: ${algorithmSelect.options[algorithmSelect.selectedIndex].text}</div>
        <div>🔀 TSP: ${tspSelect.options[tspSelect.selectedIndex].text}</div>
    `;
    routeInfo.style.display = 'block';

    updateStatus(`✓ Route optimized! Total: ${distanceKm} km`);
}