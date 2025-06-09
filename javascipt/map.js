let allMarkers = [];
let departmentInfo = [];
let employees = [];
let teams = [];     // Добавено, защото липсваше
let vehicles = [];  // Добавено, защото липсваше
let employeeStatus = {}; // 'free' или 'busy'

let map;
const BASE_POINT = [42.49483365939794, 27.474203921247042];
let incidents = [];

function createPopupContent(data) {
  return `
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
      <div><strong>№:</strong> ${data[0]}</div>
      <div><strong>СДПБЗН / РСПБЗН:</strong> ${data[1]}</div>
      <div><strong>ПК:</strong> ${data[2]}</div>
      <div><strong>Община:</strong> ${data[3]}</div>
      <div><strong>Адрес:</strong> ${data[4]}</div>
      <div><strong>Телефон:</strong> <span style="color: #007BFF;">${data[5]}</span></div>
      <div><strong>Email:</strong> ${data[6]}</div>
    </div>
  `;
}

class Incident {
  constructor(id, location, registerDate, teams, employees, vehicles, endDate = null) {
    this.id = id;
    this.location = location;
    this.registerDate = registerDate;
    this.teams = teams;
    this.employees = employees;
    this.vehicles = vehicles;
    this.endDate = endDate;
    this.marker = null;
    this.routingControl = null;
  }

  startRouting() {
    if (this.routingControl) {
      map.removeControl(this.routingControl);
    }

    const waypoints = [
      L.latLng(BASE_POINT[0], BASE_POINT[1]),
      L.latLng(this.location.lat, this.location.lng),
    ];

    this.routingControl = L.Routing.control({
      waypoints,
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      createMarker: () => null,
      show: false
    }).addTo(map);

    this.routingControl.on('routesfound', (e) => {
      const route = e.routes[0];
      if (!this.marker) {
        this.marker = L.marker(waypoints[0]).addTo(map);
      }
      this.animateMarker(route.coordinates);
    });
  }

  animateMarker(coordinates) {
    const totalDuration = 40000; // 40 seconds
    const stepDuration = totalDuration / coordinates.length;

    coordinates.forEach((coord, i) => {
      setTimeout(() => {
        this.marker.setLatLng([coord.lat, coord.lng]);
      }, stepDuration * i);
    });
  }

  finishIncident(endDate) {
    this.endDate = endDate;
    this.employees.forEach(empId => employeeStatus[empId] = 'free');

    if (this.routingControl) map.removeControl(this.routingControl);
    if (this.marker) map.removeLayer(this.marker);
  }
}

function loadMap() {
  map = L.map('map').setView(BASE_POINT, 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(BASE_POINT).addTo(map);

  // Зареждане на координатите на департаменти
  fetch('../data/department-coordinates.json')
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      data.forEach(coord => {
        const popup = createPopupContent(departmentInfo[coord.id]);
        const marker = L.marker([coord.lat, coord.lon]).addTo(map).bindPopup(popup);
        allMarkers.push(marker);
      });
    })
    .catch(err => console.error("Error loading department coordinates:", err));

  map.on('click', onMapClick);
}

function onMapClick(e) {
  openIncidentForm(e.latlng);
}

let currentIncidentLocation = null;

function openIncidentForm(latlng) {
  currentIncidentLocation = latlng;
  const modal = document.getElementById('formModal');
  if (!modal) return;
  modal.style.display = 'flex';
  clearIncidentForm();
}

function closeIncidentForm() {
  const modal = document.getElementById('formModal');
  if (!modal) return;
  modal.style.display = 'none';
}

function clearIncidentForm() {
  const form = document.getElementById('incidentForm');
  if (!form) return;
  form.reset();

  populateEmployeeSelect();
  populateTeamSelect();
  populateVehicleSelect();
}

function populateEmployeeSelect() {
  const select = document.getElementById('employeeSelect');
  if (!select) return;
  select.innerHTML = '';
  employees.forEach(emp => {
    if (employeeStatus[emp.id] === 'free') {
      const opt = document.createElement('option');
      opt.value = emp.id;
      opt.textContent = emp.name;
      select.appendChild(opt);
    }
  });
}

function populateTeamSelect() {
  const select = document.getElementById('teamSelect');
  if (!select) return;
  select.innerHTML = '';
  teams.forEach(team => {
    const opt = document.createElement('option');
    opt.value = team.id;
    opt.textContent = team.name;
    select.appendChild(opt);
  });
}

function populateVehicleSelect() {
  const select = document.getElementById('vehicleSelect');
  if (!select) return;
  select.innerHTML = '';
  vehicles.forEach(vehicle => {
    const opt = document.createElement('option');
    opt.value = vehicle.id;
    opt.textContent = vehicle.name;
    select.appendChild(opt);
  });
}

function generateUniqueId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function submitIncidentForm(e) {
  e.preventDefault();
  if (!currentIncidentLocation) {
    alert('Не е избрано местоположение на произшествието!');
    return;
  }

  const registerDate = document.getElementById('registerDate').value;
  const endDate = document.getElementById('endDate').value;

  const teamSelect = document.getElementById('teamSelect');
  const selectedTeams = Array.from(teamSelect.selectedOptions).map(o => Number(o.value));

  const vehicleSelect = document.getElementById('vehicleSelect');
  const selectedVehicles = Array.from(vehicleSelect.selectedOptions).map(o => Number(o.value));

  const employeeSelect = document.getElementById('employeeSelect');
  const selectedEmployees = Array.from(employeeSelect.selectedOptions).map(o => Number(o.value));

  if (selectedTeams.length === 0 || selectedVehicles.length === 0 || selectedEmployees.length === 0) {
    alert('Моля, изберете поне един екип, автомобил и служител.');
    return;
  }

  // Маркирай служителите като busy
  selectedEmployees.forEach(empId => employeeStatus[empId] = 'busy');

  // Създай инцидент
  const newIncident = new Incident(
    generateUniqueId(),
    currentIncidentLocation,
    registerDate,
    selectedTeams,
    selectedEmployees,
    selectedVehicles,
    endDate || null
  );

  incidents.push(newIncident);
  newIncident.startRouting();

  populateEmployeeSelect(); // Обнови списъка със служители

  closeIncidentForm();
}

function loadData() {
  Promise.all([
    fetch('../data/employees.json').then(res => res.json()),
    fetch('../data/teams.json').then(res => res.json()),
    fetch('../data/vehicles.json').then(res => res.json())
  ]).then(([empData, teamData, vehicleData]) => {
    employees = empData;
    teams = teamData;
    vehicles = vehicleData;
    employees.forEach(emp => employeeStatus[emp.id] = 'free');
    populateEmployeeSelect();
    populateTeamSelect();
    populateVehicleSelect();
  }).catch(err => console.error("Error loading employees/teams/vehicles:", err));
}

function loadDepartmentInfo() {
  return fetch('../data/department-info.json')
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      departmentInfo = data;
    })
    .catch(err => console.error("Error loading department info:", err));
}

function init() {
  loadDepartmentInfo()
    .then(() => {
      loadData();
      loadMap();

      const form = document.getElementById('incidentForm');
      if (form) form.addEventListener('submit', submitIncidentForm);

      const closeBtn = document.querySelector('.close');
      if (closeBtn) closeBtn.addEventListener('click', closeIncidentForm);

      window.addEventListener('click', (e) => {
        const modal = document.getElementById('formModal');
        if (e.target === modal) closeIncidentForm();
      });
    });
}

// Стартирай init() когато DOM е готов
document.addEventListener('DOMContentLoaded', init);
