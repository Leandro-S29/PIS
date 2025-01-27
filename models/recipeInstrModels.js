const pool = require('../config/db.js');

class RecipeInstr {
    // Get all recipes from the database
    static async getAllbyrecipe( recipe_id) {
        try {
            const [recipeInstr] = await pool.query('SELECT * FROM recipe_instructions where recipe_id = ?', [recipe_id]);
            return recipeInstr ;
        } catch (err) {
            throw new Error('Failed to get recipe Instrutcions');
        }
    }

}

module.exports = RecipeInstr;