const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const Ingredient = require('../models/recipeIngredModels');



router.get('/:recipe_id', async (req, res) => {
    try {
        const recipe_id = req.params.recipe_id;
        const ingreds = await Ingredient.getAllbyrecipe(recipe_id);
        res.json(ingreds);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get Ingredients', error: err });
    }
});


// Add a new ingredient
router.post('/', async (req, res) => {
    try {
        const {recipe_id, ingredient_id, quantity } = req.body;
        const [result] = await pool.query('INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)', [recipe_id, ingredient_id, quantity]);
        res.json({ msg: 'Ingredient added successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to add ingredient', error: err });
    }
});

// Update an ingredient by ID
router.put('/:recipe_id/:ingredient_id', async (req, res) => {
    try {
        const recipe_id = req.params.recipe_id;
        const ingredient_id = req.params.ingredient_id;  // Extraindo os parâmetros
        const {quantity} = req.body; // Obtendo o valor atualizado

        const [result] = await pool.query(
            'UPDATE recipe_ingredients SET quantity = ? WHERE recipe_id = ? AND ingredient_id = ?',
            [quantity, recipe_id, ingredient_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Ingredient not found' });
        }

        res.json({ msg: 'Ingredient updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to update ingredient', error: err });
    }
});


router.delete('/:recipe_id/:ingredient_id', async (req, res) => {
    try {
        const recipe_id = req.params.recipe_id;
        const ingredient_id = req.params.ingredient_id;
        const [result] = await pool.query('DELETE FROM recipe_ingredients WHERE recipe_id = ? AND ingredient_id = ?',
            [ recipe_id, ingredient_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Ingredient not found' });
        }
        res.json({ msg: 'Ingredient deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete ingredient', error: err });
    }
});

module.exports = router;