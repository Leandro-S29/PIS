// Fetch all categories from the server
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        return categories;
    } catch (err) {
        console.error('Error fetching categories:', err);
        return [];
    }
}

// Update categories on the server
async function updateCategories() {
    try {
        const response = await fetch('/api/categories/update');
        const result = await response.json();
        console.log(result.msg);
    } catch (err) {
        console.error('Error updating categories:', err);
    }
}

// Fetch recipes by category name from the server
async function fetchRecipesByCategory(categoryName) {
    try {
        const response = await fetch(`/api/recipes?category=${categoryName}`);
        const recipes = await response.json();
        console.log('Fetched recipes by category:', recipes);
        return recipes;
    } catch (err) {
        console.error('Error fetching recipes by category:', err);
        return [];
    }
}

// Fetch all local recipes from the server
async function fetchLocalRecipes() {
    try {
        const response = await fetch('/api/recipes');
        const recipes = await response.json();
        return recipes;
    } catch (err) {
        console.error('Error fetching local recipes:', err);
        return [];
    }
}

// Fetch all external recipes from an external API
async function fetchExternalRecipes() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        return data.meals;
    } catch (err) {
        console.error('Error fetching external recipes:', err);
        return [];
    }
}

// Fetch filtered external recipes by category name from an external API
async function fetchFilteredExternalRecipes(categoryName) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        const data = await response.json();
        const meals = data.meals;

        // Fetch detailed information for each recipe
        const detailedRecipes = await Promise.all(meals.map(async (meal) => {
            const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const detailData = await detailResponse.json();
            return detailData.meals[0];
        }));

        return detailedRecipes;
    } catch (err) {
        console.error('Error fetching filtered external recipes:', err);
        return [];
    }
}

// Load categories and create category buttons
async function loadCategories() {
    await updateCategories(); 
    const categories = await fetchCategories();
    const categoriesGrid = document.querySelector('.Categories-grid');
    categoriesGrid.innerHTML = '';

    categories.forEach(category => {
        const categoryButton = document.createElement('div');
        categoryButton.classList.add('Categories-button');
        categoryButton.dataset.categoryName = category.name;

        const categoryName = document.createElement('h3');
        categoryName.classList.add('nome');
        categoryName.textContent = category.name;

        categoryButton.appendChild(categoryName);
        categoriesGrid.appendChild(categoryButton);

        categoryButton.addEventListener('click', async () => {
            await loadRecipes(category.name);
        });
    });
}

// Load recipes and display them on the page
async function loadRecipes(categoryName = null) {
    let recipes = [];
    if (categoryName) {
        const localRecipes = await fetchRecipesByCategory(categoryName);
        const externalRecipes = await fetchFilteredExternalRecipes(categoryName);
        recipes = [...localRecipes, ...externalRecipes];
    } else {
        const localRecipes = await fetchLocalRecipes();
        const externalRecipes = await fetchExternalRecipes();
        recipes = [...localRecipes, ...externalRecipes];
    }

    const recipeGrid = document.querySelector('.recipe-grid');
    recipeGrid.innerHTML = '';

    if (Array.isArray(recipes)) {
        recipes.forEach(recipe => {
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
    } else {
        console.error('Recipes is not an array:', recipes); 
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadRecipes(); 
});