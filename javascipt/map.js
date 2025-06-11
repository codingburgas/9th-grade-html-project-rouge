var AllMarkers = []; // Global variable to store all department markers
var map; // Make map object globally accessible if needed by other functions
let DepartmentInfo = [];
// Define the fixed location of the fire station
const STATION_LOCATION = [42.49483365939794, 27.474203921247042];

// Function to create popup content for department markers (remains unchanged)
function createPopupContent(data) {
  const popupContent = `
    <div style="
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      padding: 8px;
      color: #333;
      background-color: #f9f9f9;
      border-radius: 6px;
      max-width: 250px;
    ">
      <div style="margin-bottom: 4px;"><strong>№:</strong> ${data[0]}</div>
      <div style="margin-bottom: 4px;"><strong>СДПБЗН / РСПБЗН:</strong> ${data[1]}</div>
      <div style="margin-bottom: 4px;"><strong>ПК:</strong> ${data[2]}</div>
      <div style="margin-bottom: 4px;"><strong>Община:</strong> ${data[3]}</div>
      <div style="margin-bottom: 4px;"><strong>Адрес:</strong> ${data[4]}</div>
      <div style="margin-bottom: 4px;"><strong>Телефон:</strong> <span style="color: #007BFF;">${data[5]}</span></div>
      <div><strong>Email:</strong> ${data[6]}</div>
    </div>
  `;
  return popupContent;
}

function loadMap() {
  map = L.map('map').setView(STATION_LOCATION, 15); // Set view to station location

  // Add OpenStreetMap tile layer
  var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  osm.addTo(map);

  // Add a static marker for the fire station
  L.marker(STATION_LOCATION, {
    icon: L.icon({
      iconUrl: '../pictures/location.png', // Corrected path
      iconSize: [35, 35],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    }),
    title: "Responding Vehicle"
  }).addTo(map)
    .bindPopup("Fire Station Base").openPopup(); // Show popup initially for base

  // Load coordinates and add department markers (these remain static points)
  fetch("../data/department-coordinates.json")
    .then(res => {
      if (!res.ok) {
        throw new Error("HTTP error! status: ${res.status}");
      }
      return res.json();
    })
    .then(data => {
      data.forEach(coordinates => {
        marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map).bindPopup(createPopupContent(DepartmentInfo[coordinates.id]));
        AllMarkers.push(marker);
      });
    })
    .catch(error => console.error("Error loading file:", error));

  // On map click, open fire report form and dispatch a new vehicle
  map.on('click', function (event) {
    console.log("Map clicked at:", event.latlng);

    // Open the fire report form and pass coordinates
    if (typeof openFireReportForm === 'function') {
      openFireReportForm(event.latlng.lat, event.latlng.lng);
    } else {
      console.error("openFireReportForm is not defined. Check script loading order.");
    }

    document.getElementById('fireReportForm').addEventListener('submit', () => {
      const incidentDestinationMarker = L.marker([event.latlng.lat, event.latlng.lng], {
        icon: L.icon({
          iconUrl: '../pictures/red-flag.png', // Ensure you have this icon
          iconSize: [35, 35],
          iconAnchor: [17, 35],
          popupAnchor: [0, -35]
        }),
        title: "Incident Location"
      }).addTo(map);
      incidentDestinationMarker.bindPopup(`Incident at:<br>Lat: ${event.latlng.lat.toFixed(4)}<br>Lon: ${event.latlng.lng.toFixed(4)}`).openPopup();

      // 2. Create a NEW marker for the responding vehicle (this is the one that will animate)
      const vehicleMarker = L.marker(STATION_LOCATION, {
        icon: L.icon({
          iconUrl: '../pictures/fire-icon.png', // Ensure you have this icon
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        }),
        title: "Responding Vehicle"
      }).addTo(map);
      vehicleMarker.bindPopup("Arriving...").openPopup();


      // 3. Create a NEW routing control for THIS specific vehicleMarker
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(STATION_LOCATION[0], STATION_LOCATION[1]), // Start from station
          L.latLng(event.latlng.lat, event.latlng.lng)       // To clicked destination
        ],
        createMarker: function (i, waypoint, n) {
          return null; // Don't create default markers; we manage our own vehicleMarker
        },
        addWaypoints: false,
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        // Styling the route line for this specific vehicle
        lineOptions: {
          styles: [{ color: '#007bff', opacity: 0.7, weight: 5, className: 'animated-route' }]
        },
      });

      routingControl.on('routesfound', function (e) {
        const coordinates = e.routes[0].coordinates;
        const totalDuration = 30000; // 30 seconds
        const delayPerStep = totalDuration / coordinates.length;

        let i = 0;
        // Recursive function to animate THIS vehicleMarker
        function animateVehicle() {
          if (i < coordinates.length) {
            vehicleMarker.setLatLng([coordinates[i].lat, coordinates[i].lng]);
            i++;
            setTimeout(animateVehicle, delayPerStep);
          } else {
            console.log("Vehicle reached destination.");
            vehicleMarker.bindPopup("Vehicle Arrived!").openPopup();

            // You might want to remove the route line after the animation
            map.removeControl(routingControl);
          }
        }
        animateVehicle(); // Start animating this specific vehicleMarker
      }).addTo(map);

      // This routingControl is local to this click event, allowing multiple
      // concurrent routes to be displayed and animated.
    });
  })


}

function GetData() {
  const dataInput = document.querySelector("[data-search]");

  fetch('../data/department-info.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error! status: ${response.status}");
      }
      return response.json();
    })
    .then(data => {
      DepartmentInfo = data;
      const store = data.map(department => {
        return { name: department[1], id: Number(department[0]) };
      });

      dataInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();

        store.forEach(user => {
          const isVisible = user.name.toLowerCase().includes(value);
          const marker = AllMarkers[user.id - 1];
          if (marker) {
            marker.setOpacity(isVisible ? 1 : 0);
          }
        });
      });
    })
    .catch(error => console.error("Error loading file:", error));
}


GetData();

// Initialize the map when the script loads
loadMap();