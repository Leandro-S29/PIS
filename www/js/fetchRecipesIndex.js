// Fetch two random local recipes from the server
async function fetchTwoLocalRecipes() {
    try {
        const response = await fetch('/api/recipes');
        const recipes = await response.json();
        return recipes.sort(() => 0.5 - Math.random()).slice(0, 2); // Get 2 random local recipes
    } catch (err) {
        console.error('Error fetching local recipes:', err);
        return [];
    }
}

// Fetch two random external recipes from an external API
async function fetchTwoExternalRecipes() {
    try {
        const response1 = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data1 = await response1.json();
        const response2 = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data2 = await response2.json();
        return [...data1.meals, ...data2.meals];
    } catch (err) {
        console.error('Error fetching external recipes:', err);
        return [];
    }
}

// Load featured recipes and display them on the page
async function loadFeaturedRecipes() {
    const localRecipes = await fetchTwoLocalRecipes();
    const externalRecipes = await fetchTwoExternalRecipes();
    const allRecipes = [...localRecipes, ...externalRecipes];

    const recipeGrid = document.querySelector('.recipe-grid');
    recipeGrid.innerHTML = '';

    allRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const recipeLink = document.createElement('a');
        const isExternal = recipe.idMeal ? 'true' : 'false';
        recipeLink.href = `/html/recipeView.html?id=${recipe.recipe_id || recipe.idMeal}&external=${isExternal}`;
        recipeCard.appendChild(recipeLink);

        const recipeImage = document.createElement('img');
        recipeImage.classList.add('foto');
        recipeImage.src = recipe.image_url || recipe.strMealThumb;
        recipeLink.appendChild(recipeImage);

        const recipeName = document.createElement('h3');
        recipeName.classList.add('nome');
        recipeName.textContent = recipe.recipe_name || recipe.strMeal;
        recipeLink.appendChild(recipeName);

        recipeGrid.appendChild(recipeCard);
    });
}

document.addEventListener('DOMContentLoaded', loadFeaturedRecipes);