// Fetch recipe details by ID
async function fetchRecipeById(recipeId) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`);
        const recipe = await response.json();
        return recipe;
    } catch (err) {
        console.error('Error fetching recipe details:', err);
        return null;
    }
}

// Fetch external recipe details by ID
async function fetchExternalRecipeById(recipeId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        return data.meals[0];
    } catch (err) {
        console.error('Error fetching external recipe details:', err);
        return null;
    }
}

// Fetch collections for the dropdown
async function fetchCollections() {
    try {
        const response = await fetch('/api/collections');
        const collections = await response.json();
        return collections;
    } catch (err) {
        console.error('Error fetching collections:', err);
        return [];
    }
}

// Populate the collections dropdown
async function populateCollectionsDropdown() {
    const collectionSelect = document.getElementById('collectionSelect');
    const collections = await fetchCollections();

    collections.forEach(collection => {
        const option = document.createElement('option');
        option.value = collection.collection_id;
        option.textContent = collection.name;
        collectionSelect.appendChild(option);
    });
}

// Add recipe to collection
async function addRecipeCollection() {
    const collectionSelect = document.getElementById('collectionSelect');
    const collectionId = collectionSelect.value;
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const isExternal = urlParams.get('external') === 'true';

    if (!collectionId) {
        alert('Please select a collection.');
        return;
    }

    try {
        const endpoint = isExternal ? `/api/collections/${collectionId}/external_favorites` : `/api/collections/${collectionId}/favorites`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipeId })
        });

        if (response.ok) {
            alert('Recipe added to collection successfully.');
        } else {
            alert('Failed to add recipe to collection.');
        }
    } catch (err) {
        console.error('Error adding recipe to collection:', err);
    }
}

// Load recipe details and populate collections dropdown
async function loadRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const isExternal = urlParams.get('external') === 'true';

    if (!recipeId) {
        console.error('No recipe ID found in URL');
        return;
    }

    const recipe = isExternal ? await fetchExternalRecipeById(recipeId) : await fetchRecipeById(recipeId);

    if (!recipe) {
        console.error('Recipe not found');
        return;
    }

    document.querySelector('.recipe-title').textContent = recipe.recipe_name || recipe.strMeal;
    document.querySelector('.recipe-image').src = recipe.image_url || recipe.strMealThumb;
    document.querySelector('.recipe-description').textContent = recipe.recipe_description || '';

    if (isExternal) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${ingredient} (${measure})`);
            }
        }
        document.querySelector('.recipe-ingredients').textContent = `Ingredients: ${ingredients.join(', ')}`;
    } else {
        document.querySelector('.recipe-ingredients').textContent = `Ingredients: ${recipe.ingredients || 'N/A'}`;
    }

    document.querySelector('.recipe-instructions').textContent = recipe.instructions || recipe.strInstructions;
    document.querySelector('.recipe-prep-time').textContent = recipe.preparation_time ? `Preparation Time: ${recipe.preparation_time}` : '';
    document.querySelector('.recipe-difficulty').textContent = recipe.difficulty ? `Difficulty: ${recipe.difficulty}` : '';
    document.querySelector('.recipe-price').textContent = recipe.price ? `Price: ${recipe.price} €` : '';
    document.querySelector('.recipe-category').textContent = `Category: ${recipe.category_name || recipe.strCategory}`;
    document.querySelector('.recipe-author').textContent = `Created by: ${recipe.created_by || 'TheMealDB'}`;
    document.querySelector('.recipe-created-at').textContent = recipe.created_at ? `Created at: ${recipe.created_at}` : '';

    await populateCollectionsDropdown();
}

document.addEventListener('DOMContentLoaded', loadRecipeDetails);