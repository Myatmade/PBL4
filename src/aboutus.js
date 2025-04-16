// Function to handle navigation between pages
function navigateTo(page) {
    try{
    window.location.href = `${page}.html`
    } catch {
        alert("Page does not exist");
    }
}

// Attach event listeners to buttons after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
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
});