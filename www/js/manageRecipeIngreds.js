const params = new URLSearchParams(window.location.search);
const recipeId = params.get('recipeId');

console.log('Recipe ID:', recipeId);

document.addEventListener('DOMContentLoaded', async () => {
    const ingredientList = document.querySelector('.ingredient-list');
    
    const addingred = document.getElementById('add-Ingredient-button');

    const continueButton = document.getElementById('Continue');
    continueButton.onclick = async() => {window.location.href = `/html/Instructions.html?recipeId=${recipeId}`;}

    addingred.onclick = () => addingredient(recipeId);
    try{
        const response = await fetch(`/api/recipeingreds/${recipeId}`);
        const ingreds = await response.json();
        console.log(ingreds);
        ingreds.forEach(ingred => {
           
            const ingredientCard = document.createElement('div');
            ingredientCard.classList.add('ingredient-card');

            const ingredientInfo = document.createElement('div');
            ingredientInfo.classList.add('ingredient-info');
            ingredientInfo.innerHTML = `
            <p><strong>Ingredient:</strong>${ingred.ingredient_id}</p>
            <p><strong>Quantity:</strong>${ingred.quantity}</p>
            `;

            const ingredientActions = document.createElement('div');
            ingredientActions.classList.add('ingredient-actions');
            ingredientActions.innerHTML = `
            <button onclick="editingredients(${ingred.recipe_id}, ${ingred.ingredient_id}, '${ingred.quantity}')">Edit</button> 
            <button onclick="deleteIngred(${ingred.recipe_id}, ${ingred.ingredient_id})"> Delete </button>`;


            ingredientCard.appendChild(ingredientInfo);
            ingredientCard.appendChild(ingredientActions);
            ingredientList.appendChild(ingredientCard);
    });
        }catch(err){
            console.error('Error fetching ingreds', err);
        }
});

function editingredients(recipe_id, ingredient_id, quantity){
    console.log(`editing ingredient: ${ingredient_id} in ${recipe_id}`);
    const ingredientListPanel = document.querySelector('.ingredient-list-panel');
    const editIngredientPanel = document.querySelector('.edit-ingredient-panel');

    if (ingredientListPanel && editIngredientPanel) {
        ingredientListPanel.classList.add('hidden');
        editIngredientPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }

    document.getElementById('editingredientquantity').value = quantity;


    const editIngredientForm = document.getElementById('editIngredientForm');
    editIngredientForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedquantity = event.target.quantity.value;
            const response = await fetch(`/api/recipeingreds/${recipe_id}/${ingredient_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: updatedquantity})
            });
            if (response.ok) {
                alert('ingrediente updated successfully.');
                window.location.reload();
            } else {
                alert('Failed to update ingrediente.');
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

}


function addingredient(recipe_id) {
    console.log('adding ingredient');
    const ingredientListPanel = document.querySelector('.ingredient-list-panel');
    const addIngredientPanel = document.querySelector('.add-ingredient-panel');

    if (ingredientListPanel && addIngredientPanel) {
        ingredientListPanel.classList.add('hidden');
        addIngredientPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }
  



    const addIngredientForm = document.getElementById('addIngredientForm');
    addIngredientForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const recipe = recipe_id;
            const newingred = event.target.ingred.value;
            const newquantity = event.target.quantity.value;
            const response = await fetch(`/api/recipeingreds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipe_id: recipe, ingredient_id: newingred, quantity: newquantity})
            });
            if (response.ok) {
                alert('ingredient added successfully.');
                window.location.reload();
            } else {
                alert('Failed to add ingrediente.');
                console.log(response);
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };
  
}

function cancelAdd() {
    console.log('Cancel add');
    const ingredientListPanel = document.querySelector('.ingredient-list-panel');
    const addIngredientPanel = document.querySelector('.add-ingredient-panel');

    if (ingredientListPanel && addIngredientPanel) {
        ingredientListPanel.classList.remove('hidden');
        addIngredientPanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}

async function deleteIngred(recipe_id, ingredient_id) {
    console.log('Deleting ingredient:', recipe_id, ingredient_id);
    if (confirm('Are you sure you want to delete this ingredient?')) {
        try {
            const response = await fetch(`/api/recipeingreds/${recipe_id}/${ingredient_id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('ingredient deleted successfully.');
                window.location.reload();
            } else {
                alert('Failed to delete ingredient.');
            }
        } catch (err) {
            console.error('Error deleting ingredient:', err);
        }
    }
}

