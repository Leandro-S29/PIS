async function fetchRecipes() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        const randomRecipes = getRandomRecipes(data.meals, 4);
        displayRecipes(randomRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function getRandomRecipes(recipes, count) {
    const shuffled = recipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayRecipes(recipes) {
    const recipeGrid = document.querySelector('.recipe-grid');
    recipeGrid.innerHTML = ''; // Clear existing content

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
            <p>${recipe.strInstructions.substring(0, 100)}...</p>
        `;

        recipeGrid.appendChild(recipeCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchRecipes);