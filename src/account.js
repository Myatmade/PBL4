document.addEventListener("DOMContentLoaded", () => {
    // Retrieve logged-in user information
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));


    // Navigation Feature
    // Function to handle navigation between pages
    function navigateTo(page) {
      try{
      window.location.href = `${page}.html`
      } catch {
          alert("Page does not exist");
      }
  }

  // Get all the sidebar buttons
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach((button) => {
      button.addEventListener("click", () => {
          const buttonText = button.textContent.trim();
          navigateTo(buttonText.toLowerCase().replace(/\s+/g, ''))
      });
  });

  // Add event listener to the circle button for account navigation
  const circleButton = document.querySelector(".circle-btn");
  if (circleButton) {
      circleButton.addEventListener("click", () => {
          navigateTo("account");
      });
  }

  
    if (!loggedInUser) {
      alert("No user is logged in. Redirecting to login page.");
      window.location.href = "index.html"; // Redirect to login page if no user is logged in
      return;
    }
  
    // Display user information in the profile section
    const usernameElement = document.querySelector(".profile-info p:nth-child(2)");
    const emailElement = document.querySelector(".profile-info p:nth-child(3)");
    const universityNameElement = document.querySelector(".profile-info p:nth-child(4)");
    const universityCampusElement = document.querySelector(".profile-info p:nth-child(5)");
  
    usernameElement.innerHTML = `<strong>Username:</strong> ${loggedInUser.username}`;
    emailElement.innerHTML = `<strong>Email:</strong> ${loggedInUser.email}`;
    universityNameElement.innerHTML = `<strong>University Name:</strong> ${loggedInUser.universityName}`;
    universityCampusElement.innerHTML = `<strong>University Campus:</strong> ${loggedInUser.universityCampus}`;

    // Map the object properties to their respective select elements
    document.getElementById("region").value = loggedInUser.region;
    document.getElementById("discount").value = loggedInUser.discount;
    document.getElementById("flavor").value = loggedInUser.flavor;
    document.getElementById("diet").value = loggedInUser.diet;
  
    // Handle Edit Profile Button
    const editProfileButton = document.querySelector(".action-btn");
    editProfileButton.addEventListener("click", () => {
      window.location.href = "profile.html"; // Redirect to profile page
    });

    // Update user preferences
    // Helper function to update localStorage
    function updateUserInLocalStorage(updatedUser) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex(user => user.email === loggedInUser.email);
      // console.log(loggedInUser.email);
      // console.log(userIndex);

      if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem("users", JSON.stringify(users));
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
          alert("Information updated successfully!");
      } else {
          alert("Error: User not found in storage.");
      }
  }
    // Select the form and the button
    const saveButton = document.getElementById("save_preferences");

    // Add an event listener to the button
    saveButton.addEventListener("click", (event) => {
      // Prevent the form from refreshing the page (default behavior)
      event.preventDefault();
      console.log("running");

      // Get the selected values from the form
        loggedInUser.region = document.getElementById("region").value,
        loggedInUser.discount = document.getElementById("discount").value,
        loggedInUser.flavor = document.getElementById("flavor").value,
        loggedInUser.diet = document.getElementById("diet").value
        updateUserInLocalStorage(loggedInUser);
    });

  });
  