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

// NEW: Variable to store the timeout ID for the message auto-hide
let messageTimeoutId;

// NEW: Function to show a custom message on screen
function showMessage(messageText, type = 'success', duration = 4000) {
    const customMessage = document.getElementById('customMessage');
    const messageTextElement = document.getElementById('messageText');

    if (customMessage && messageTextElement) {
        // Clear any existing auto-hide timeout
        clearTimeout(messageTimeoutId);

        // Reset classes and set the new type
        customMessage.className = ''; // Remove all existing classes
        customMessage.classList.add(type);

        messageTextElement.textContent = messageText;
        customMessage.classList.add('is-visible'); // Make it visible

        // Set a new timeout to auto-hide the message
        messageTimeoutId = setTimeout(() => {
            hideMessage();
        }, duration);
    }
}

// NEW: Function to hide the custom message
function hideMessage() {
    const customMessage = document.getElementById('customMessage');
    if (customMessage) {
        clearTimeout(messageTimeoutId); // Clear any pending hide calls
        customMessage.classList.remove('is-visible'); // Hide it
        
        // Optional: Remove type class after transition for clean state
        // This makes sure the background color resets cleanly for next message
        customMessage.addEventListener('transitionend', function handler() {
            if (!customMessage.classList.contains('is-visible')) { // Only reset if it's truly hidden
                customMessage.className = ''; // Remove all classes
            }
            customMessage.removeEventListener('transitionend', handler); // Clean up listener
        });
    }
}


// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const fireReportForm = document.getElementById('fireReportForm');
    const customMessageCloseBtn = document.querySelector('#customMessage .message-close');

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

            // --- REPLACE alert() with showMessage() ---
            showMessage('Fire incident reported successfully!', 'success'); // Shows a green success message
            
            closeFireReportForm(); // Close the modal after submission
        });
    }

    // NEW: Add event listener to the custom message close button
    if (customMessageCloseBtn) {
        customMessageCloseBtn.addEventListener('click', hideMessage);
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