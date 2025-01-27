const pool = require('../config/db.js');

class Ingredient {
    // Get all ingredients
    static async getAll() {
        try {
            const [ingredients] = await pool.query('SELECT * FROM ingredients');
            return ingredients;
        } catch (err) {
            throw new Error('Failed to get ingredients');
        }
    }
}

module.exports = Ingredient;