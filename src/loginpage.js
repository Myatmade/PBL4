document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");

  // Load existing users from localStorage
  function loadUsersFromLocalStorage() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  // Save users to localStorage
  function saveUsersToLocalStorage(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Handle form switching
  switchToSignup.addEventListener("click", () => {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
  });

  switchToLogin.addEventListener("click", () => {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
  });

  // Handle Signup
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Capture input values
    const username = signupForm.querySelector('input[placeholder="Username"]').value;
    const email = signupForm.querySelector('input[placeholder="Email"]').value;
    const password = signupForm.querySelector('input[placeholder="Password"]').value;
    const universityName = signupForm.querySelector('input[placeholder="University Name"]').value;
    const universityCampus = signupForm.querySelector('input[placeholder="University Campus"]').value;

    // Check if all fields are filled
    if (username && email && password && universityName && universityCampus) {
      const users = loadUsersFromLocalStorage();

      // Check if the email is already registered
      if (users.some((user) => user.email === email)) {
        alert("Email already registered!");
        return;
      }
      // Creating default parameters
      const region = "Asia";
      const discount = "No";
      const flavor = "Spicy";
      const diet = "Non-Vegan";
      // Add the new user to the list
      users.push({ username, email, password, universityName, universityCampus, region, discount, flavor, diet});

      saveUsersToLocalStorage(users);

      alert(`Account created successfully for ${username}!`);
      signupForm.reset();
      signupForm.classList.remove("active");
      loginForm.classList.add("active");
    } else {
      alert("Please fill in all fields.");
    }
  });

  // Handle Login
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const users = loadUsersFromLocalStorage();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      alert(`Welcome back, ${user.username}!`);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      // Redirect to quiz.html after successful login
      window.location.href = "quiz.html";
    } else {
      alert("Invalid email or password.");
    }
  });

  // Check if a user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    alert(`Welcome back, ${loggedInUser.username}!`);
    // Optionally redirect logged-in users directly to quiz.html
    window.location.href = "quiz.html";
  }
});
