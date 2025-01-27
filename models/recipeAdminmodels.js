const pool = require('../config/db.js');

class Recipe {
    // Get all recipes from the database
    static async getAll() {
        try {
            const [recipes] = await pool.query('SELECT * FROM recipes');
            return recipes;
        } catch (err) {
            throw new Error('Failed to get recipes');
        }
    }



    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('DELETE FROM recipe_instructions WHERE recipe_id = ?', [id]);
            await connection.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id]);
            await connection.query('DELETE FROM recipes WHERE recipe_id = ?', [id]);
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw new Error('Failed to delete Recipe');
        } finally {
            connection.release();
        }
    }
}




module.exports = Recipe;