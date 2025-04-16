document.addEventListener("DOMContentLoaded", () => {
    const usernameSpan = document.getElementById("username");
    const emailSpan = document.getElementById("email");
    const universityNameSpan = document.getElementById("universityName");
    const universityCampusSpan = document.getElementById("universityCampus");

    const updateUsernameForm = document.getElementById("updateUsernameForm");
    const updateEmailForm = document.getElementById("updateEmailForm");
    const updatePasswordForm = document.getElementById("updatePasswordForm");
    const updateUniversityForm = document.getElementById("updateUniversityForm");
    const backToAccountButton = document.getElementById("backToAccount");

    // Load the logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("No user is logged in. Redirecting to login page.");
        window.location.href = "login.html";
        return;
    }

    // Display the user's information
    usernameSpan.textContent = loggedInUser.username;
    emailSpan.textContent = loggedInUser.email;
    universityNameSpan.textContent = loggedInUser.universityName;
    universityCampusSpan.textContent = loggedInUser.universityCampus;

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

    // Handle username update
    updateUsernameForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newUsername = document.getElementById("newUsername").value;

        if (newUsername) {
            loggedInUser.username = newUsername;
            updateUserInLocalStorage(loggedInUser);
            usernameSpan.textContent = newUsername;
            updateUsernameForm.reset();
        } else {
            alert("Please enter a valid username.");
        }
    });

    // Handle email update
    updateEmailForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newEmail = document.getElementById("newEmail").value;

        if (newEmail) {
            const new_user = { ...loggedInUser };
            new_user.email = newEmail;
            updateUserInLocalStorage(new_user);
            emailSpan.textContent = newEmail;
            loggedInUser.email = newEmail;
            updateEmailForm.reset();
        } else {
            alert("Please enter a valid email.");
        }
    });

    // Handle password update
    updatePasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newPassword = document.getElementById("newPassword").value;

        if (newPassword) {
            loggedInUser.password = newPassword;
            updateUserInLocalStorage(loggedInUser);
            updatePasswordForm.reset();
        } else {
            alert("Please enter a valid password.");
        }
    });

    // Handle university information update
    updateUniversityForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newUniversityName = document.getElementById("newUniversityName").value;
        const newUniversityCampus = document.getElementById("newUniversityCampus").value;

        if (newUniversityName && newUniversityCampus) {
            loggedInUser.universityName = newUniversityName;
            loggedInUser.universityCampus = newUniversityCampus;
            updateUserInLocalStorage(loggedInUser);
            universityNameSpan.textContent = newUniversityName;
            universityCampusSpan.textContent = newUniversityCampus;
            updateUniversityForm.reset();
        } else {
            alert("Please fill in both fields.");
        }
    });

    // Handle Back to Account
    backToAccountButton.addEventListener("click", () => {
        window.location.href = "account.html"; // Redirect to account.html
    });
});
