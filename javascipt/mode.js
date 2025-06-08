let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-toggle');

const DarkmodeOn = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
};

const DarkmodeOff = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');
};

// Apply dark mode on page load if previously active
if (darkmode === 'active') {
  DarkmodeOn();
}

// Toggle dark mode on button click
themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode');
  darkmode !== 'active' ? DarkmodeOn() : DarkmodeOff();
});
