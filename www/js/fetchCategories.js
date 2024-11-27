async function fetchCategories() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();
        displayCategories(data.categories); // Update to use `categories` instead of `meals`
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function displayCategories(categories) { // Fixed capitalization
    const CategoriesGrid = document.querySelector('.Categories-grid');
    CategoriesGrid.innerHTML = ''; // Clear existing content

    categories.forEach(category => { // Adjusted naming for clarity
        const CategoriesButton = document.createElement('button');
        CategoriesButton.classList.add('Categories-button');

        CategoriesButton.innerHTML = `
            <h5 class="nome">${category.strCategory}</h5>
         
            
        `;
        CategoriesButton.addEventListener('click', () => fetchRecipesByCategory(category.strCategory));
        CategoriesGrid.appendChild(CategoriesButton);
    });
}



// Initialize by fetching categories when the page loads
document.addEventListener('DOMContentLoaded', fetchCategories);