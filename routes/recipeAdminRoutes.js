const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const Recipe = require('../models/recipeAdminmodels');

// Get all recipes or recipes by category name
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.getAll();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get recipes', error: err.message });
    }
});


router.put('/:recipe_id', async (req, res) => {
    try {
        const recipe_id = req.params.recipe_id;
        const { name, author_id, description, difficulty, category_id, prep_time, preco} = req.body;

        const [result] = await pool.query(
            'UPDATE recipes SET name = ?, author_id = ?, description = ?, difficulty = ?, category_id = ?, prep_time = ?, price = ? WHERE recipe_id = ?',
            [name, author_id, description, difficulty, category_id, prep_time, preco, recipe_id]
        );


        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.json({ msg: 'Recipe updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to update Recipe', error: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, author_id, description, difficulty, category_id, prep_time, preco, image_url } = req.body;
        const [result] = await pool.query('INSERT INTO recipes (name, author_id, description, difficulty, category_id, prep_time, price, image_url) VALUES (?,?,?,?,?,?,?,?)', [name, author_id, description, difficulty, category_id, prep_time, preco, image_url]);
        res.json({ msg: 'recipe added successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to add recipe', error: err });
    }
});



router.delete('/:recipe_id', async (req, res) => {
    try {
        const {recipe_id} = req.params;
        await Recipe.delete(recipe_id);
        res.json({ msg: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete Recipe', error: err });
    }
});

module.exports = router;