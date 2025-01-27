const pool = require('../config/db.js');

class Category {
    // Get all categories
    static async getAll() {
        try {
            const [categories] = await pool.query('SELECT * FROM recipe_categories');
            return categories;
        } catch (err) {
            console.error('Error getting categories:', err);
            throw new Error('Failed to get categories');
        }
    }

    // Update categories from API
    static async updateFromAPI(apiCategories) {
        try {
            const [dbCategories] = await pool.query('SELECT name FROM recipe_categories');
            const dbCategoryNames = dbCategories.map(cat => cat.name);

            const newCategories = apiCategories.filter(cat => !dbCategoryNames.includes(cat.strCategory));

            for (const category of newCategories) {
                await pool.query('INSERT INTO recipe_categories (name) VALUES (?)', [category.strCategory]);
            }
        } catch (err) {
            console.error('Error updating categories from API:', err);
            throw new Error('Failed to update categories');
        }
    }

    // Add a new category
    static async add(name) {
        try {
            await pool.query('INSERT INTO recipe_categories (name) VALUES (?)', [name]);
        } catch (err) {
            console.error('Error adding category:', err);
            throw new Error('Failed to add category');
        }
    }

    // Update a category
    static async update(id, name) {
        try {
            await pool.query('UPDATE recipe_categories SET name = ? WHERE category_id = ?', [name, id]);
        } catch (err) {
            console.error('Error updating category:', err);
            throw new Error('Failed to update category');
        }
    }

    // Delete a category
    static async delete(id) {
        try {
            await pool.query('DELETE FROM recipe_categories WHERE category_id = ?', [id]);
        } catch (err) {
            console.error('Error deleting category:', err);
            throw new Error('Failed to delete category');
        }
    }
}

module.exports = Category;