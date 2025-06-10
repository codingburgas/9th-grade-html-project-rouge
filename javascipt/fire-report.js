function openFireReportForm(lat, lng) {
    const modal = document.getElementById('fireReportModal');
    const latInput = document.getElementById('incidentLat');
    const lonInput = document.getElementById('incidentLon');
    const startTimeInput = document.getElementById('startTime');

    if (modal) {
        modal.classList.add('is-visible'); 

        if (latInput) latInput.value = lat.toFixed(6);
        if (lonInput) lonInput.value = lng.toFixed(6);

        if (startTimeInput) {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            startTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        }

        populateFireReportDropdowns();
    }
}

function closeFireReportForm() {
    const modal = document.getElementById('fireReportModal');
    if (modal) {
        modal.classList.remove('is-visible');
        document.getElementById('fireReportForm').reset();
    }
}

function populateFireReportDropdowns() {
    const teamSelect = document.getElementById('assignedTeam');
    const vehicleSelect = document.getElementById('assignedVehicle');

    teamSelect.innerHTML = '<option value="">Select Team</option>';
    vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';

    const teams = typeof getTeams === 'function' ? getTeams() : []; 
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });

    const vehicles = typeof getVehicles === 'function' ? getVehicles() : [];
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = vehicle.name;
        vehicleSelect.appendChild(option);
    });
}

let messageTimeoutId;

function showMessage(messageText, type = 'success', duration = 4000) {
    const customMessage = document.getElementById('customMessage');
    const messageTextElement = document.getElementById('messageText');

    if (customMessage && messageTextElement) {
        clearTimeout(messageTimeoutId);

        customMessage.className = '';
        customMessage.classList.add(type);

        messageTextElement.textContent = messageText;
        customMessage.classList.add('is-visible');

        messageTimeoutId = setTimeout(() => {
            hideMessage();
        }, duration);
    }
}

function hideMessage() {
    const customMessage = document.getElementById('customMessage');
    if (customMessage) {
        clearTimeout(messageTimeoutId);
        customMessage.classList.remove('is-visible');
        customMessage.addEventListener('transitionend', function handler() {
            if (!customMessage.classList.contains('is-visible')) {
                customMessage.className = '';
            }
            customMessage.removeEventListener('transitionend', handler);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fireReportForm = document.getElementById('fireReportForm');
    const customMessageCloseBtn = document.querySelector('#customMessage .message-close');

    if (fireReportForm) {
        fireReportForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(fireReportForm);
            const report = {};
            for (let [key, value] of formData.entries()) {
                report[key] = value;
            }

            console.log("Fire Incident Reported:", report);

            showMessage('Fire incident reported successfully!', 'success');
            closeFireReportForm();
        });
    }

    if (customMessageCloseBtn) {
        customMessageCloseBtn.addEventListener('click', hideMessage);
    }

    const fireReportModal = document.getElementById('fireReportModal');
    if (fireReportModal) {
        window.addEventListener('click', (event) => {
            if (event.target === fireReportModal) {
                closeFireReportForm();
            }
        });
    }
});
