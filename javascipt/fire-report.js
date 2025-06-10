// Global functions for the fire report modal
function openFireReportForm(lat, lng) {
    const modal = document.getElementById('fireReportModal');
    const latInput = document.getElementById('incidentLat');
    const lonInput = document.getElementById('incidentLon');
    const startTimeInput = document.getElementById('startTime');

    if (modal) {
        modal.style.display = 'flex'; // Show the modal

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
        modal.style.display = 'none';
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
    const teams = getTeams(); 
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });

    // Vehicles are loaded by fire-report-data.js (via getVehicles())
    const vehicles = getVehicles();
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
            if (event.target === fireReportModal) {
                fireReportModal.style.display = 'none';
            }
        });
    }
});