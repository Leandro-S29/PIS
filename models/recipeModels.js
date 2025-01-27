const pool = require('../config/db.js');

class Recipe {
    // Get all recipes from the database
    static async getAll() {
        try {
            const [recipes] = await pool.query('SELECT * FROM recipe_details_with_instructions');
            return recipes;
        } catch (err) {
            throw new Error('Failed to get recipes');
        }
    }

    // Get recipes by category name from the database
    static async getByCategoryName(categoryName) {
        try {
            const [recipes] = await pool.query('SELECT * FROM recipe_details_with_instructions WHERE category_name = ?', [categoryName]);
            return recipes;
        } catch (err) {
            throw new Error('Failed to get recipes by category name');
        }
    }

    // Get recipe by ID from the database
    static async getById(recipeId) {
        try {
            const [recipes] = await pool.query('SELECT * FROM recipe_details_with_instructions WHERE recipe_id = ?', [recipeId]);
            return recipes[0];
        } catch (err) {
            throw new Error('Failed to get recipe by ID');
        }
    }
}

module.exports = Recipe;