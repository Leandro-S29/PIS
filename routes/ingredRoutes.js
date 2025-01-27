const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const Ingredient = require('../models/IngredModels');

// Get all ingredients
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.getAll();
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get ingredients', error: err });
    }
});

// Add a new ingredient
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await pool.query('INSERT INTO ingredients (name) VALUES (?)', [name]);
        res.json({ msg: 'Ingredient added successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to add ingredient', error: err });
    }
});

// Update an ingredient by ID
router.put('/:ingredientId', async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        const { name } = req.body;
        const [result] = await pool.query('UPDATE ingredients SET name = ? WHERE ingredient_id = ?', [name, ingredientId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Ingredient not found' });
        }
        res.json({ msg: 'Ingredient updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to update ingredient', error: err });
    }
});

// Delete an ingredient by ID
router.delete('/:ingredientId', async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        const [result] = await pool.query('DELETE FROM ingredients WHERE ingredient_id = ?', [ingredientId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Ingredient not found' });
        }
        res.json({ msg: 'Ingredient deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete ingredient', error: err });
    }
});




module.exports = router;