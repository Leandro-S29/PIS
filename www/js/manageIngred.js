document.addEventListener('DOMContentLoaded', async () => {
    const ingredientList = document.querySelector('.ingredient-list');

    try {
        const response = await fetch('/api/ingredients');
        const ingredients = await response.json();

        ingredients.forEach(ingredient => {
            const ingredientCard = document.createElement('div');
            ingredientCard.classList.add('ingredient-card');

            const ingredientInfo = document.createElement('div');
            ingredientInfo.classList.add('ingredient-info');
            ingredientInfo.innerHTML = `
                <p><strong>ingredient:</strong> ${ingredient.name}</p>
            `;

            const ingredientActions = document.createElement('div');
            ingredientActions.classList.add('ingredient-actions');
            ingredientActions.innerHTML = `
                <button onclick="editingredient(${ingredient.ingredient_id}, '${ingredient.name}')">Edit</button>
                <button onclick="deleteingredient(${ingredient.ingredient_id})">Delete</button>
            `;

            ingredientCard.appendChild(ingredientInfo);
            ingredientCard.appendChild(ingredientActions);
            ingredientList.appendChild(ingredientCard);
        });
    } catch (err) {
        console.error('Error fetching ingredients:', err);
    }
});

//edit ingredient details
function editingredient(ingredienteId, name) {
    console.log('Editing ingredient:', ingredienteId, name);
    const ingredientListPanel = document.querySelector('.ingredient-list-panel');
    const editIngredientPanel = document.querySelector('.edit-ingredient-panel');

    if (ingredientListPanel && editIngredientPanel) {
        ingredientListPanel.classList.add('hidden');
        editIngredientPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }

    document.getElementById('editingredientname').value = name;


    const editIngredientForm = document.getElementById('editIngredientForm');
    editIngredientForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedname = event.target.name.value;
            const response = await fetch(`/api/ingredients/${ingredienteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: updatedname})
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

//cancel the ingredient details edit
function cancelEdit() {
    console.log('Cancel edit');
    const ingredientListPanel = document.querySelector('.ingredient-list-panel');
    const editIngredientPanel = document.querySelector('.edit-ingredient-panel');

    if (ingredientListPanel && editIngredientPanel) {
        ingredientListPanel.classList.remove('hidden');
        editIngredientPanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}

//delete an ingredient
async function deleteingredient(ingredienteId) {
    console.log('Deleting ingredient:', ingredienteId);
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`/api/ingredients/${ingredienteId}`, {
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

//add an ingredient
function addingredient() {
    console.log('adding ingredient:');
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
            const newname = event.target.name.value;
            const response = await fetch(`/api/ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newname})
            });
            if (response.ok) {
                alert('ingrediente added successfully.');
                window.location.reload();
            } else {
                alert('Failed to update ingrediente.');
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };
  
}

//cancel add ingredient
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
