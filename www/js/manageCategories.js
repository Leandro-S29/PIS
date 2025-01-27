document.addEventListener('DOMContentLoaded', async () => {
    const categoryList = document.querySelector('.category-list');

    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();

        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('category-card');

            const categoryInfo = document.createElement('div');
            categoryInfo.classList.add('category-info');
            categoryInfo.innerHTML = `
                <p><strong>Category Name:</strong> ${category.name}</p>
            `;

            const categoryActions = document.createElement('div');
            categoryActions.classList.add('category-actions');
            categoryActions.innerHTML = `
                <button onclick="editCategory(${category.category_id}, '${category.name}')">Edit</button>
                <button onclick="deleteCategory(${category.category_id})">Delete</button>
            `;

            categoryCard.appendChild(categoryInfo);
            categoryCard.appendChild(categoryActions);
            categoryList.appendChild(categoryCard);
        });
    } catch (err) {
        console.error('Error fetching categories:', err);
    }
});

// Edit category details
function editCategory(categoryId, name) {
    console.log('Editing category:', categoryId, name);
    const categoryListPanel = document.querySelector('.category-list-panel');
    const editCategoryPanel = document.querySelector('.edit-category-panel');

    if (categoryListPanel && editCategoryPanel) {
        categoryListPanel.classList.add('hidden');
        editCategoryPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }

    document.getElementById('editCategoryName').value = name;

    const editCategoryForm = document.getElementById('editCategoryForm');
    editCategoryForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedName = event.target.name.value;
            console.log('Updating category with new name:', updatedName);
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: updatedName })
            });
            if (response.ok) {
                alert('Category updated successfully.');
                window.location.reload();
            } else {
                alert('Failed to update category.');
            }
        } catch (err) {
            console.error('Error updating category:', err);
        }
    };
}

// Cancel category edit
function cancelEdit() {
    console.log('Cancel edit');
    const categoryListPanel = document.querySelector('.category-list-panel');
    const editCategoryPanel = document.querySelector('.edit-category-panel');

    if (categoryListPanel && editCategoryPanel) {
        categoryListPanel.classList.remove('hidden');
        editCategoryPanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}

// Show add category panel
function showAddCategoryPanel() {
    console.log('Show add category panel');
    const categoryListPanel = document.querySelector('.category-list-panel');
    const addCategoryPanel = document.querySelector('.add-category-panel');

    if (categoryListPanel && addCategoryPanel) {
        categoryListPanel.classList.add('hidden');
        addCategoryPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }

    const addCategoryForm = document.getElementById('addCategoryForm');
    addCategoryForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const newName = event.target.name.value;
            console.log('Adding new category with name:', newName);
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });
            if (response.ok) {
                alert('Category added successfully.');
                window.location.reload();
            } else {
                alert('Failed to add category.');
            }
        } catch (err) {
            console.error('Error adding category:', err);
        }
    };
}

// Cancel add category
function cancelAdd() {
    console.log('Cancel add');
    const categoryListPanel = document.querySelector('.category-list-panel');
    const addCategoryPanel = document.querySelector('.add-category-panel');

    if (categoryListPanel && addCategoryPanel) {
        categoryListPanel.classList.remove('hidden');
        addCategoryPanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}

// Delete category
async function deleteCategory(categoryId) {
    console.log('Deleting category:', categoryId);
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Category deleted successfully.');
                window.location.reload();
            } else {
                alert('Failed to delete category.');
            }
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    }
}