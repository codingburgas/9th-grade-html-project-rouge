var AllMarkers = [];


function loadMap()
{
  // Initialize the Leaflet map and set the initial view (center and zoom)
var map = L.map('map').setView([42.49483365939794, 27.474203921247042], 15);

// Add OpenStreetMap tile layer (map visuals)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add the tile layer to the map
osm.addTo(map);

var marker = L.marker([42.49483365939794, 27.474203921247042]).addTo(map);

fetch("../data/department-coordinates.json")
.then(res => {
  if(!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
})
.then(data => {
  data.forEach(coordinates => {
    marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map);
    AllMarkers.push(marker);
  });
})
.catch(error => console.error("Error loading file:", error));

// map click event 
map.on('click', function(event){
  console.log(event);
  var secondMarker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);

  L.Routing.control({
    waypoints: [
      L.latLng(42.49483365939794, 27.474203921247042),
      L.latLng(event.latlng.lat, event.latlng.lng)
    ]
  }).on('routesfound', function(event){
    console.log(event);
    event.routes[0].coordinates.forEach(function(coord, index){
      setTimeout(() => {
        marker.setLatLng([coord.lat, coord.lng]);
      }, 100 * index);
    });
  }).addTo(map);
});
}


function GetData() {
  const dataInput = document.querySelector("[data-search]");

  fetch('../data/department-info.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
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


loadMap();
GetData();