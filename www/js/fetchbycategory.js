async function fetchbycategory(categoryName) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        const data = await response.json();
        displayRecipes(data.meals); // Display the recipes of the selected category
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}
console.log(categoryName);
// Display recipes of the selected category
function displayRecipes(recipes) {
    const RecipesGrid = document.querySelector('.Recipe-grid');
    RecipesGrid.innerHTML = ''; // Clear existing content

    recipes.forEach(recipe => {
        const RecipeCard = document.createElement('div');
        RecipeCard.classList.add('Recipe-card');

        RecipeCard.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
            <h6 class="recipe-name">${recipe.strMeal}</h6>
        `;

        RecipesGrid.appendChild(RecipeCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchbycategory);