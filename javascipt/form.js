// For the Registration Form
function openRegistrationForm() {
    const modal = document.getElementById('registrationFormModal');
    if (modal) {
        modal.style.display = 'flex'; // Use flex to center the modal
    }
}

function closeRegistrationForm() {
    const modal = document.getElementById('registrationFormModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    const regModal = document.getElementById('registrationFormModal');
    if (event.target === regModal) {
        regModal.style.display = 'none';
    }
    // Fire report modal handled in fire-report.js
});