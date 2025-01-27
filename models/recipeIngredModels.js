const pool = require('../config/db.js');

class RecipeIngreds {
    // Get all recipes from the database
    static async getAllbyrecipe( recipe_id) {
        try {
            const [recipeIngreds] = await pool.query('SELECT * FROM recipe_ingredients where recipe_id = ?', [recipe_id]);
            return recipeIngreds ;
        } catch (err) {
            throw new Error('Failed to get recipe Ingredients');
        }
    }

}

module.exports = RecipeIngreds;