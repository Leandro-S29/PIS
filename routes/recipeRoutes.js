const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipeModels');

// Get all recipes or recipes by category name
router.get('/', async (req, res) => {
    try {
        const categoryName = req.query.category;
        const recipes = categoryName ? await Recipe.getByCategoryName(categoryName) : await Recipe.getAll();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get recipes', error: err.message });
    }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.getById(recipeId);
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get recipe', error: err.message });
    }
});

module.exports = router;