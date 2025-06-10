var AllMarkers = [];
var DepartmentInfo = [];

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
  var map = L.map('map').setView([42.49483365939794, 27.474203921247042], 15);

  // Add OpenStreetMap tile layer
  var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  osm.addTo(map);

  // Add default marker
  var marker = L.marker([42.49483365939794, 27.474203921247042]).addTo(map);

  // Load coordinates and add department markers
  fetch("../data/department-coordinates.json")
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      data.forEach(coordinates => {
        const deptData = DepartmentInfo[coordinates.id];
        const deptMarker = L.marker([coordinates.lat, coordinates.lon])
          .addTo(map)
          .bindPopup(createPopupContent(deptData));
        AllMarkers.push(deptMarker);
      });
    })
    .catch(error => console.error("Error loading coordinates file:", error));

  // On map click, calculate route and animate marker
  map.on('click', function(event) {
    console.log(event);
    var secondMarker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);

    L.Routing.control({
      waypoints: [
        L.latLng(42.49483365939794, 27.474203921247042),
        L.latLng(event.latlng.lat, event.latlng.lng)
      ]
    }).on('routesfound', function(event) {
      console.log(event);
      event.routes[0].coordinates.forEach(function(coord, index) {
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
    .catch(error => console.error("Error loading info file:", error));
}

// Initialize
GetData();
loadMap();
