// Function to handle navigation between pages
function navigateTo(page) {
    try{
    window.location.href = `${page}.html`
    } catch {
        alert("Page does not exist");
    }
}

const params = new URLSearchParams(window.location.search);
const query_quiz = params.get('query');

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

    // If a query exists, display fetch recipe
    if (query_quiz) {
        query = query_quiz;
        spoonacular_get();
        add_marker(query);
        }
    })

// Javascript time baby
// Dropdown menu stuff
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const dropdownId = button.getAttribute("data-dropdown");
        const dropdownMenu = document.getElementById(dropdownId);

        // Close other dropdowns
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.style.display = "none";
            }
        });

        // Toggle the current dropdown menu
        if (dropdownMenu.style.display === "none" || !dropdownMenu.style.display) {
            dropdownMenu.style.display = "block";
        } else {
            dropdownMenu.style.display = "none";
        }
    });
});

// Map stuff
const form = document.getElementById("search_bar_form") 
const input = document.getElementById("search_bar_input")

const api_key='0a6051abde5e4d4d8cffca384adaff01';
const number=2;

let map;
let query = ``;

// Add an event listener to the form to handle the submit event
form.addEventListener("submit", function(event){
    // Prevent the form from submitting and reloading the page
    event.preventDefault();

    // Update the input value
    query = input.value;  // This can be any value you want to set
    spoonacular_get();
    add_marker(query);
});

// API Parameters
  // Dropdown button functionality
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const preferenceKeys = ['region', 'discount', 'flavor', 'diet'];
  const region = ""; // WIP
  spice = 0; // WIP
  const diet = loggedInUser.diet; // The only working preference
async function spoonacular_get(){
    try{
      const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${api_key}&number=${number}&diet=${diet}&query=${query}`);
      const data = await response.json();
        
        displayRecipes(data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

function displayRecipes(recipes) {
    let recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = ""; // Clear previous results

    // Check if recipes exist
    if (recipes.length === 0) {
        recipeList.innerHTML = "<li>No recipes found.</li>"; // Optional: Show message if no recipes
        return;
    }

    recipes.forEach((recipe) => {
        const listItem = document.createElement("li");
        listItem.className = "recipe-card"; // Apply the card class

        // Create title element
        const title = document.createElement("div");
        title.className = "recipe-title";
        title.textContent = recipe.title;

        // Create a button for more actions
        const button = document.createElement("a");
        button.className = "recipe-button";
        button.addEventListener("click", () => {
            localStorage.setItem(`${recipe.title}`, JSON.stringify(recipe)); // Store the recipe as a JSON string
        });
        button.href = `recipe.html?query=${recipe.title}`; // Link to recipe page
        button.textContent = "View Recipe";

        // Append elements to the list item
        listItem.appendChild(title);
        listItem.appendChild(button); // Button below title

        // Append the list item to the recipe list
        recipeList.appendChild(listItem);
    });
}
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
  
    map = new Map(document.getElementById("map"), {
      center: { lat: 34.81004270667786, lng: 135.56072481941342 },
      zoom: 14,
      mapId: "idc"
    });
  }
  
  // Initialize an array to hold the markers
  let markers = [];
  
  async function add_marker(food) {
      const { Place } = await google.maps.importLibrary("places");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      
      // Clear existing markers
      clearMarkers();
  
      // Creating circle object that is centered on OIC campus and has a radius of 3km
      const {Circle} = await google.maps.importLibrary("maps");
      center = {lat: 34.810165968274035, lng: 135.560902018011};
      radius = 3000;
  
      circle = new google.maps.Circle({
        center: center,
        radius: radius,
      })
  
      const request = {
        textQuery: `${food} restaurant Osaka Ibaraki`,
          fields: ["displayName", "location", "types"],
          locationRestriction: circle.getBounds(),
          maxResultCount: 10,
          language: "ja",
      };
  
      const request2 = {
        textQuery: `${food} restaurant Osaka Ibaraki`,
        fields: ["displayName", "location", "types"],
        locationRestriction: circle.getBounds(),
        maxResultCount: 10,
        language: "en",
      };
  
      if (!areRequestsEqual(request, request2)) {
        // If they are different, append request2 to request
        // You can combine the two by putting them into an array or handle them separately
        const requests = [request, request2];
      }
  
      const { places } = await Place.searchByText(request);
      if (places.length) {
          console.log(places);
  
          const { LatLngBounds } = await google.maps.importLibrary("core");
          const bounds = new LatLngBounds();
  
          // Loop through and add new markers
          places.forEach((place) => {
              const marker = new AdvancedMarkerElement({
                  map,
                  position: place.location,
                  title: place.displayName,
              });
  
              // Add marker to the markers array
              markers.push(marker);
  
              bounds.extend(place.location);
              console.log(place);
          });
  
          // Adjust the map to fit the bounds of the new markers
          map.fitBounds(bounds);
      }
  }
  
  // Function to clear all existing markers from the map
  function clearMarkers() {
      markers.forEach((marker) => marker.setMap(null)); // Remove marker from the map
      markers = []; // Clear the markers array
  }
  
  // Function to compare two requests
  function areRequestsEqual(request1, request2) {
    return JSON.stringify(request1) === JSON.stringify(request2);
  }
  
  initMap();

  // Dropdown button functionality
  i = 0;
    // Loop through each category button and apply the active state
    preferenceKeys.forEach((key) => {
        if (loggedInUser[key]) {
            const button_value = loggedInUser[key];
            const button = document.getElementById(`${preferenceKeys[i]}_button`);
            if (key === "discount"){
                button.textContent = `${button_value} Student Discount`;
            } else {
                button.textContent = button_value;
            }
        }
        i += 1;
    });