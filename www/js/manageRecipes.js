let proximareceita;
document.addEventListener('DOMContentLoaded', async () => {
    const recipeList = document.querySelector('.recipe-list');
  
    try{
        const response = await fetch('/api/recipesadmin');
        const recipes = await response.json();

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');

            const recipeInfo = document.createElement('div');
            recipeInfo.classList.add('recipe-info');
            recipeInfo.innerHTML = `<p><strong>Recipe Name:</strong>${recipe.name}</p>`;

            const recipeActions = document.createElement('div');
            recipeActions.classList.add('recipe-actions');
            recipeActions.innerHTML = `
            <button onclick="editRecipe(
            ${recipe.recipe_id}, 
            '${recipe.name}',
            ${recipe.author_id},
            '${recipe.description}',
            '${recipe.difficulty}',
            ${recipe.category_id},
            ${recipe.prep_time},
            ${recipe.price},
            )">Edit</button> 
            <button onclick="deleteRecipe(${recipe.recipe_id})"> Delete </button>`;


            recipeCard.appendChild(recipeInfo);
            recipeCard.appendChild(recipeActions);
            recipeList.appendChild(recipeCard);

    });
        }catch(err){
            console.error('Error fetching recipes', err);
        }
    });

    function editRecipe(recipe_id, name, author_id, description, difficulty, category_id, prep_time, preco, created_at){
        console.log('Editing Recipe:', recipe_id, name);
        const recipeListPanel = document.querySelector('.recipe-list-panel');
        const editRecipePanel = document.querySelector('.edit-recipe-panel');

        if(recipeListPanel && encodeURIComponent){
            recipeListPanel.classList.add('hidden');
            editRecipePanel.classList.remove('hidden');
        }else{
            console.error('panels not found');
        }

        document.getElementById('editRecipeName').value = name;
        document.getElementById('editRecipeAuthor').value = author_id;
        document.getElementById('editRecipeDescription').value = description;
        document.getElementById('editRecipedifficulty').value = difficulty;
        document.getElementById('editRecipeCategory').value = category_id;
        document.getElementById('editRecipeTime').value = prep_time;
        document.getElementById('editRecipePreco').value = preco;

        const editRecipeForm = document.getElementById('editRecipeForm');
        editRecipeForm.onsubmit = async (event) => {
            event.preventDefault();
            try {
                const updatedName = event.target.editRecipeName.value;
                const updatedAuthorId = event.target.editRecipeAuthor.value;
                const updatedDescription = event.target.editRecipeDescription.value;
                const updatedDifficulty = event.target.editRecipedifficulty.value;
                const updatedCategoryId = event.target.editRecipeCategory.value;
                const updatedPrepTime = event.target.editRecipeTime.value;
                const updatedPreco = event.target.editRecipePreco.value;
        
                console.log('Updating recipe...');
                const response = await fetch(`/api/recipesadmin/${recipe_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: updatedName,
                        author_id: updatedAuthorId,
                        description: updatedDescription,
                        difficulty: updatedDifficulty,
                        category_id: updatedCategoryId,
                        prep_time: updatedPrepTime,
                        preco: updatedPreco
                    })
                });
                if(response.ok){
                    alert('recipe updated successfully.');
                    const isExternal = false;
                    window.location.href = `/html/recipeIngreds.html?recipeId=${recipe_id}`;
                }else{
                    alert('Failed to updated recipe.');
                }
            } catch (err) {
                console.error('Error updating recipe:', err);
            }
        };

    }
    
    function cancelEdit() {
        console.log('Cancel edit');
        const recipeListPanel = document.querySelector('.recipe-list-panel');
        const editRecipePanel = document.querySelector('.edit-recipe-panel');
    
        if (recipeListPanel && editRecipePanel) {
            recipeListPanel.classList.remove('hidden');
            editRecipePanel.classList.add('hidden');
        } else {
            console.error('Panels not found');
        }
    }

function AddRecipe() {
  
    const recipeListPanel = document.querySelector('.recipe-list-panel');
    const addRecipePanel = document.querySelector('.add-recipe-panel');

    if (recipeListPanel && addRecipePanel) {
        recipeListPanel.classList.add('hidden');
        addRecipePanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }


    const addRecipeForm = document.getElementById('addrecipeForm');
    addRecipeForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const newName = event.target.Name.value;
            const newAuthorId = event.target.Author.value;
            const newDescription = event.target.Description.value;
            const newDifficulty = event.target.difficulty.value;
            const newCategoryId = event.target.Category.value;
            const newPrepTime = event.target.Time.value;
            const newPreco = event.target.Preco.value;
            const newImg = event.target.img.value;
            console.log('Adding new Recipe with name:', newName);
            const response = await fetch('/api/recipesadmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, author_id: newAuthorId, description: newDescription ,  difficulty:newDifficulty , category_id:newCategoryId , prep_time: newPrepTime, preco: newPreco, image_url:newImg})
            });
            if (response.ok) {
                alert('Recipe added successfully.');
                window.location.reload();
            } else {
                alert('Failed to add Recipe.');
            }
        } catch (err) {
            console.error('Error adding Recipe:', err);
        }
    };
}


function cancelAdd() {
    console.log('Cancel add');
    const recipeListPanel = document.querySelector('.recipe-list-panel');
    const addRecipePanel = document.querySelector('.add-recipe-panel');

    if (recipeListPanel && addRecipePanel) {
        recipeListPanel.classList.remove('hidden');
        addRecipePanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}

async function deleteRecipe(recipe_id) {
    console.log('Deleting recipe:', recipe_id);
    if (confirm('Are you sure you want to delete this recipe?')) {
        try {
            const response = await fetch(`/api/recipesadmin/${recipe_id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('recipe deleted successfully.');
                window.location.reload();
            } else {
                alert('Failed to delete recipe.');
            }
        } catch (err) {
            console.error('Error deleting recipe:', err);
        }
    }
}
