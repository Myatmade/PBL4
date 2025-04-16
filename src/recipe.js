document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('search-input');
    const recipeContent = document.getElementById('recipe-content');

    // Navigation feature
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

    // If a query exists, retrieve from local storage and display the recipe
    if (query) {
        const storedRecipe_JSON = localStorage.getItem(`${query}`); 
        if (storedRecipe_JSON) {
            const storedRecipe_JS = JSON.parse(storedRecipe_JSON);
            console.log("Displaying recipe")
            displayRecipe(storedRecipe_JS);
        } else {
            console.log("Fetching recipe")
            fetchRecipe(query)
        }
    }

    // Handle search form submission
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const newQuery = searchInput.value.trim();
        if (newQuery) {
            window.location.href = `recipe.html?query=${encodeURIComponent(newQuery)}`;
        }
    });

    function fetchRecipe(query) {
        fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=1&apiKey=0a6051abde5e4d4d8cffca384adaff01`)
            .then(response => response.json())
            .then(data => {
                recipeContent.innerHTML = ''; // Clear previous content

                if (data.results.length > 0) {
                    const recipe = data.results[0]; 

                    displayRecipe(recipe);
                } else {
                    recipeContent.innerHTML = '<p>No recipes found. Please try a different search.</p>';
                }
            })
            .catch(error => {
                recipeContent.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
                console.error('Error fetching recipes:', error);
            });
    }

    function displayRecipe(recipe) {
        console.log(recipe.id);
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=0a6051abde5e4d4d8cffca384adaff01`)
            .then(response => response.json())
            .then(recipeDetails => {
                // Clear previous content and create a new structure
                recipeContent.innerHTML = `
                    <h2 class="recipe-name">${recipeDetails.title}</h2>
                    <div class="recipe-image">
                        <img src="${recipeDetails.image}" alt="${recipeDetails.title}">
                    </div>
                    <div class="recipe-details-container">
                        <div class="recipe-details">
                            <h3>Recipe Details</h3>
                            <div class="prep-details">
                                <p><strong>Prep Time:</strong> ${recipeDetails.preparationMinutes || 'N/A'} mins</p>
                                <p><strong>Cook Time:</strong> ${recipeDetails.cookingMinutes || 'N/A'} mins</p>
                                <p><strong>Total Time:</strong> ${recipeDetails.readyInMinutes} mins</p>
                                <p><strong>Servings:</strong> ${recipeDetails.servings}</p>
                            </div>
                        </div>
                        <div class="ingredients">
                            <h3>Ingredients</h3>
                            <ul>
                                ${recipeDetails.extendedIngredients.map(ingredient => `
                                    <li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="recipe-description">
                        <h3>Description</h3>
                        <p>${recipeDetails.summary || 'No description available.'}</p>
                    </div>
                    <div class="recipe-steps">
                        <h3>Step-by-Step Instructions</h3>
                        ${recipeDetails.analyzedInstructions.length > 0
                            ? recipeDetails.analyzedInstructions[0].steps.map((step, index) => `
                                <div class="step"><strong>Step ${index + 1}:</strong> ${step.step}</div>
                              `).join('')
                            : '<p>No instructions available.</p>'
                        }
                    </div>
                `;
            })
            .catch(error => {
                recipeContent.innerHTML = '<p>Error fetching recipe details. Please try again later.</p>';
                console.error('Error fetching recipe details:', error);
            });
    }
});