
function LogIn() {
  if(localStorage.getItem("AccessCheck") == 'true')
  {
  let user = JSON.parse(localStorage.getItem("loggedInUser"))
  document.getElementById("open-button").innerHTML = `<button onclick="DropDown()" class="open-button" style="font-size:20px; color:var(--TextColor);">${user.username}</button>`;
  }
}
function LogOut() {
  document.getElementById("open-button").innerHTML = '<button class="open-button" onclick="openForm()"><img class="account"src="../pictures/account.png"></button>'
  localStorage.setItem("AccessCheck", 'false');
  document.getElementById("dropDownMenu").style.display = "none";
  alert("You have been logged out!");
}

function DropDown()
{
    const menu = document.getElementById("dropDownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.addEventListener("click", function (event) {
  if (!event.target.closest("#open-button") && !event.target.closest("#dropDownMenu")) {
    document.getElementById("dropDownMenu").style.display = "none";
  }
});

function openForm() {
  document.getElementById("loginModal").style.display = "flex";
}

function changeForm() {
  if (document.getElementById("formModal").style.display == "none") {
    document.getElementById("formModal").style.display = "flex";
    document.getElementById("loginModal").style.display = "none";
  }
  else {
    document.getElementById("formModal").style.display = "none";
    document.getElementById("loginModal").style.display = "flex";
  }
}
function closeForm() {
  document.getElementById("formModal").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
}
// Sign-up: Save user info
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("useremail").value;
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.some(u => u.username === username);
  if (userExists) {
    alert("Username already exists.");
    document.getElementById("username").value = "";
    return
  }
  console.log(users)
  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Sign-up successful!");
  document.getElementById("username").value = "";
  document.getElementById("useremail").value = "";
  document.getElementById("password").value = "";
  closeForm();
});


document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(user => user.email === email && user.password === password);

  if (foundUser) {
    alert(`Welcome back, ${foundUser.username}!`);
    closeForm();
    localStorage.setItem("AccessCheck", 'true')
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({  // Convert object to JSON string
        username: foundUser.username,
        email: foundUser.email,
        password: foundUser.password
      })
    );
    LogIn();
  } else {
    alert("Invalid email or password.");
  }
});
function showFireReportForm() {
    const modal = document.getElementById('fireReportModal');
    modal.classList.add('is-visible');
}

function closeFireReportForm() {
    const modal = document.getElementById('fireReportModal');
    modal.classList.remove('is-visible');
}

LogIn();