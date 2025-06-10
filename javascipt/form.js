function showFireReportForm() {
    const modal = document.getElementById('fireReportModal');
    modal.classList.add('is-visible');
}

function closeFireReportForm() {
    const modal = document.getElementById('fireReportModal');
    modal.classList.remove('is-visible');
}

// And if you have a way to open it, for example:
// document.getElementById('yourOpenButtonId').addEventListener('click', showFireReportForm);