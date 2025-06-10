var Employees = [];
var Teams = [];
var Vehicles = [];

async function loadFireReportData() {
    try {
        const [employeesRes, teamsRes, vehiclesRes] = await Promise.all([
            fetch('../data/employees.json'),
            fetch('../data/teams.json'),
            fetch('../data/vehicles.json')
        ]);

        Employees = await employeesRes.json();
        Teams = await teamsRes.json();
        Vehicles = await vehiclesRes.json();

        console.log("Fire Report Data Loaded:", { Employees, Teams, Vehicles });
    } catch (error) {
        console.error("Error loading fire report data files:", error);
    }
}

// Helper functions to access the loaded data
function getTeams() {
    return Teams;
}

function getVehicles() {
    return Vehicles;
}

function getEmployees() {
    return Employees;
}

// Call to load data when the script executes
loadFireReportData();