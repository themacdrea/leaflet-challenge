// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map (you can choose other providers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to create earthquake markers and popups
function createEarthquakeMarkers(data) {
  var earthquakes = data.features;

  // Loop through the earthquake data
  earthquakes.forEach(earthquake => {
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];
    var latitude = earthquake.geometry.coordinates[1];
    var longitude = earthquake.geometry.coordinates[0];

    // Create a circle marker with size and color based on magnitude and depth
    var marker = L.circleMarker([latitude, longitude], {
      radius: magnitude * 3, // Adjust the multiplier as needed for appropriate marker size
      fillColor: getColor(depth),
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });

    // Create a popup with additional information about the earthquake
    var popupContent = `<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`;
    marker.bindPopup(popupContent);

    // Add the marker to the map
    marker.addTo(map);
  });
}

// Function to determine the color based on the depth
function getColor(depth) {
  // You can define your own color scale here based on the depth values
  // For example, return different colors for different depth ranges
  return depth > 300 ? '#800026' :
         depth > 200 ? '#BD0026' :
         depth > 100 ? '#E31A1C' :
         depth > 50 ? '#FC4E2A' :
         depth > 10 ? '#FD8D3C' :
                      '#FFEDA0';
}

// Fetch earthquake data from USGS GeoJSON feed
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Process the earthquake data and create markers on the map
    createEarthquakeMarkers(data);
  })
  .catch(error => {
    console.error('Error fetching earthquake data:', error);
  });

  // Create a custom legend control
var legend = L.control({ position: 'bottomright' });

// Function to update the legend content
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0, 10, 50, 100, 200, 300];
  var colors = ['#FFEDA0', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

  // Loop through the depth ranges and generate the legend content
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1) + ' km<br>' : '+ km');
  }

  return div;
};

// Add the legend to the map
legend.addTo(map);
