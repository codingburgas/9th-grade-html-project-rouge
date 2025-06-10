// Global functions for the fire report modal
function openFireReportForm(lat, lng) {
    const modal = document.getElementById('fireReportModal');
    const latInput = document.getElementById('incidentLat');
    const lonInput = document.getElementById('incidentLon');
    const startTimeInput = document.getElementById('startTime');

    if (modal) {
        // Use classList.add() to trigger the CSS transition
        modal.classList.add('is-visible'); 

        // Pre-fill coordinates
        if (latInput) latInput.value = lat.toFixed(6);
        if (lonInput) lonInput.value = lng.toFixed(6);

        // Set current time for start time
        if (startTimeInput) {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            startTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
        
        // Populate dropdowns when the form opens
        populateFireReportDropdowns();
    }
}

function closeFireReportForm() {
    const modal = document.getElementById('fireReportModal');
    if (modal) {
        // Use classList.remove() to trigger the CSS transition
        modal.classList.remove('is-visible');
        
        // Optionally reset form fields here
        document.getElementById('fireReportForm').reset();
    }
}

// Function to populate Team and Vehicle dropdowns
function populateFireReportDropdowns() {
    const teamSelect = document.getElementById('assignedTeam');
    const vehicleSelect = document.getElementById('assignedVehicle');

    // Clear existing options
    teamSelect.innerHTML = '<option value="">Select Team</option>';
    vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';

    // Teams are loaded by fire-report-data.js (via getTeams())
    // Ensure getTeams() exists and returns an array of team objects {id: ..., name: ...}
    const teams = typeof getTeams === 'function' ? getTeams() : []; 
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });

    // Vehicles are loaded by fire-report-data.js (via getVehicles())
    // Ensure getVehicles() exists and returns an array of vehicle objects {id: ..., name: ...}
    const vehicles = typeof getVehicles === 'function' ? getVehicles() : [];
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = vehicle.name;
        vehicleSelect.appendChild(option);
    });
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const fireReportForm = document.getElementById('fireReportForm');
    if (fireReportForm) {
        fireReportForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(fireReportForm);
            const report = {};
            for (let [key, value] of formData.entries()) {
                report[key] = value;
            }

            // You can now process the 'report' object (e.g., send to server, store locally)
            console.log("Fire Incident Reported:", report);

            alert('Fire incident reported successfully (simulated)! Check console for data.');
            closeFireReportForm();
        });
    }

    // Close the modal if the user clicks outside of it
    const fireReportModal = document.getElementById('fireReportModal');
    if (fireReportModal) {
        window.addEventListener('click', (event) => {
            // Only close if the click is directly on the modal overlay, not its content
            if (event.target === fireReportModal) {
                closeFireReportForm(); // Use the existing close function
            }
        });
    }
});