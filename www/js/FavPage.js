document.addEventListener('DOMContentLoaded', async () => {
    const collectionsGrid = document.getElementById('collectionsGrid');
    const favoritesGrid = document.getElementById('favoritesGrid');

    // Fetch and display collections
    try {
        const response = await fetch('/api/collections');
        const collections = await response.json();

        collections.forEach(collection => {
            const collectionCard = document.createElement('div');
            collectionCard.classList.add('collection-card');

            const collectionIcon = document.createElement('div');
            collectionIcon.classList.add('collection-icon');
            collectionIcon.innerHTML = '🍴'; 

            const collectionInfo = document.createElement('div');
            collectionInfo.classList.add('collection-info');
            collectionInfo.innerHTML = `
                <p><strong>Collection Name:</strong> ${collection.name}</p>
                <p><strong>Description:</strong> ${collection.description}</p>
            `;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteCollection(collection.collection_id);

            collectionCard.appendChild(collectionIcon);
            collectionCard.appendChild(collectionInfo);
            collectionCard.appendChild(deleteButton);
            collectionCard.onclick = () => showFavorites(collection.collection_id);
            collectionsGrid.appendChild(collectionCard);
        });
    } catch (err) {
        console.error('Error fetching collections:', err);
    }
});

// Create a new collection
async function createCollection() {
    const newCollectionName = document.getElementById('newCollectionName').value;
    const newCollectionDescription = document.getElementById('newCollectionDescription').value;
    if (!newCollectionName) {
        alert('Please enter a collection name.');
        return;
    }

    try {
        const response = await fetch('/api/collections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCollectionName, description: newCollectionDescription })
        });

        if (response.ok) {
            alert('Collection created successfully.');
            window.location.reload();
        } else {
            alert('Failed to create collection.');
        }
    } catch (err) {
        console.error('Error creating collection:', err);
    }
}

// Delete a collection
async function deleteCollection(collectionId) {
    if (confirm('Are you sure you want to delete this collection?')) {
        try {
            const response = await fetch(`/api/collections/${collectionId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Collection deleted successfully.');
                window.location.reload();
            } else {
                alert('Failed to delete collection.');
            }
        } catch (err) {
            console.error('Error deleting collection:', err);
        }
    }
}

// Show favorites for a specific collection
async function showFavorites(collectionId) {
    const favoritesGrid = document.getElementById('favoritesGrid');
    favoritesGrid.innerHTML = ''; 

    try {
        const response = await fetch(`/api/collections/${collectionId}/favorites`);
        const favorites = await response.json();

        for (const favorite of favorites) {
            if (!favorite.recipe_name && !favorite.external_recipe_id) {
                continue;
            }

            const favoriteCard = document.createElement('div');
            favoriteCard.classList.add('favorite-card');

            const favoriteLink = document.createElement('a');
            const isExternal = favorite.external_recipe_id ? 'true' : 'false';
            favoriteLink.href = `/html/recipeView.html?id=${favorite.recipe_id || favorite.external_recipe_id}&external=${isExternal}`;
            favoriteCard.appendChild(favoriteLink);

            const favoriteImage = document.createElement('img');
            favoriteImage.classList.add('favorite-image');

            let externalRecipe = null;
            if (favorite.recipe_image_url) {
                favoriteImage.src = favorite.recipe_image_url;
            } else if (favorite.external_recipe_id) {
                externalRecipe = await fetchExternalRecipeById(favorite.external_recipe_id);
                if (externalRecipe) {
                    favoriteImage.src = externalRecipe.strMealThumb || 'default-image-url.jpg';
                } else {
                    favoriteImage.src = 'default-image-url.jpg';
                }
            } else {
                favoriteImage.src = 'default-image-url.jpg';
            }

            favoriteLink.appendChild(favoriteImage);

            const favoriteInfo = document.createElement('div');
            favoriteInfo.classList.add('favorite-info');
            favoriteInfo.innerHTML = `
                <p><strong>Recipe Name:</strong> ${favorite.recipe_name || (externalRecipe ? externalRecipe.strMeal : 'Unknown')}</p>
            `;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeRecipeFromCollection(collectionId, favorite.recipe_id || favorite.external_recipe_id, !!favorite.external_recipe_id);

            favoriteCard.appendChild(favoriteInfo);
            favoriteCard.appendChild(removeButton);
            favoritesGrid.appendChild(favoriteCard);
        }
    } catch (err) {
        console.error('Error fetching favorites:', err);
    }
}

// Remove a recipe from a collection
async function removeRecipeFromCollection(collectionId, recipeId, isExternal) {
    if (confirm('Are you sure you want to remove this recipe from the collection?')) {
        try {
            const response = await fetch(`/api/collections/${collectionId}/favorites`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipeId, isExternal })
            });

            if (response.ok) {
                alert('Recipe removed successfully.');
                showFavorites(collectionId);
            } else {
                alert('Failed to remove recipe.');
            }
        } catch (err) {
            console.error('Error removing recipe:', err);
        }
    }
}

// Fetch external recipe details by ID
async function fetchExternalRecipeById(recipeId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (err) {
        console.error('Error fetching external recipe details:', err);
        return null;
    }
}