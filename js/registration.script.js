const roleSelect = document.getElementById("roleSelect");
const uniqueIdGroup = document.getElementById("uniqueIdGroup");
const uniqueIdLabel = document.getElementById("uniqueIdLabel");
const uniqueIdInput = document.getElementById("uniqueIdInput");
const form = document.getElementById("registrationForm");

// ===============================
// ROLE BASED DYNAMIC ID FIELD
// ===============================
roleSelect.addEventListener("change", () => {
  const role = roleSelect.value;

  if (!role) {
    uniqueIdGroup.style.display = "none";
    uniqueIdInput.value = "";
    return;
  }

  // Visual feedback: brief fade-in for the dynamic field
  uniqueIdGroup.style.display = "block";
  uniqueIdGroup.style.animation = "slideUpFade 0.4s ease-out";

  if (role === "student") {
    uniqueIdLabel.innerText = "Student ID";
    uniqueIdInput.placeholder = "Enter your Student ID";
  } 
  else if (role === "faculty") {
    uniqueIdLabel.innerText = "Faculty ID";
    uniqueIdInput.placeholder = "Enter your Faculty ID";
  } 
  else if (role === "admin") {
    uniqueIdLabel.innerText = "Admin Secret Code";
    uniqueIdInput.placeholder = "Enter admin access code";
  }
});

// ===============================
// REGISTRATION FORM SUBMIT
// ===============================
form.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value.trim();
  const role = roleSelect.value;
  const uniqueId = uniqueIdInput.value.trim();

  if (!name || !email || !password || !role || !uniqueId) {
    alert("Please fill all fields");
    return;
  }

  const users = JSON.parse(localStorage.getItem("attendx_users")) || [];

  const alreadyExists = users.some(user => user.uniqueId === uniqueId);
  if (alreadyExists) {
    alert("This ID is already registered");
    return;
  }

  const newUser = { name, email, password, role, uniqueId };
  users.push(newUser);
  localStorage.setItem("attendx_users", JSON.stringify(users));

  alert("Registration successful! Redirecting to login...");
  window.location.href = "login.html";
});