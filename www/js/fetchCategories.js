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
        const CategoriesCard = document.createElement('div');
        CategoriesCard.classList.add('Categories-card');

        CategoriesCard.innerHTML = `
            <h3 class="nome">${category.strCategory}</h3>
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" />
         
            
        `;

        CategoriesGrid.appendChild(CategoriesCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchCategories);