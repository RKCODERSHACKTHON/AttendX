const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const userId = document.getElementById("loginId").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  // 1. Predefined Prototype Credentials
  const mockUsers = [
    {
      uniqueId: "STD001",
      name: "Ritik Kumar",
      email: "student@attendx.com",
      password: "123",
      role: "student"
    },
    {
      uniqueId: "FAC001",
      name: "Dr. Sharma",
      email: "sharma@attendx.com",
      password: "123",
      role: "faculty"
    },
    {
      uniqueId: "ADM001",
      name: "System Admin",
      email: "admin@attendx.com",
      password: "123",
      role: "admin"
    }
  ];

  // 2. Validate Credentials
  const user = mockUsers.find(
    u => u.uniqueId === userId && u.password === password
  );

  if (!user) {
    alert("Invalid credentials for prototype. Use STD001 or FAC001 with password 123.");
    return;
  }

  // 3. Store logged-in user with all details for dashboard consistency
  localStorage.setItem("attendx_current_user", JSON.stringify({
    uniqueId: user.uniqueId,
    name: user.name,
    email: user.email,
    role: user.role
  }));

  // 4. Redirect by role
  if (user.role === "student") {
    window.location.href = "pages/student.html";
  } else if (user.role === "faculty") {
    window.location.href = "pages/faculty.html";
  } else if (user.role === "admin") {
    window.location.href = "pages/admin.html";
  }
});