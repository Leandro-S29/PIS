const express = require('express');
const router = express.Router();
const Collection = require('../models/collectionModels');

// Get all collections for the current user
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId; 
        const collections = await Collection.getByUserId(userId);
        res.json(collections);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get collections', error: err.message });
    }
});

// Add a new collection
router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId; 
        const { name, description } = req.body;
        const collectionId = await Collection.add(name, userId, description);
        res.status(201).json({ msg: 'Collection created successfully', collectionId });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to create collection', error: err.message });
    }
});

// Delete a collection
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Collection.delete(id);
        res.json({ msg: 'Collection deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete collection', error: err.message });
    }
});

// Get favorites for a specific collection
router.get('/:id/favorites', async (req, res) => {
    try {
        const { id } = req.params;
        const favorites = await Collection.getFavoritesByCollectionId(id);
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get favorites for collection', error: err.message });
    }
});

// Remove a recipe from a collection
router.delete('/:id/favorites', async (req, res) => {
    try {
        const { id } = req.params;
        const { recipeId, isExternal } = req.body;
        await Collection.removeFavorite(id, recipeId, isExternal);
        res.json({ msg: 'Recipe removed from collection successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to remove recipe from collection', error: err.message });
    }
});

// Add an internal recipe to a collection
router.post('/:id/favorites', async (req, res) => {
    try {
        const { id } = req.params;
        const { recipeId } = req.body;
        await Collection.addFavorite(id, recipeId);
        res.json({ msg: 'Recipe added to collection successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to add recipe to collection', error: err.message });
    }
});

// Add an external recipe to a collection
router.post('/:id/external_favorites', async (req, res) => {
    try {
        const { id } = req.params;
        const { recipeId } = req.body;
        await Collection.addExternalFavorite(id, recipeId);
        res.json({ msg: 'External recipe added to collection successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to add external recipe to collection', error: err.message });
    }
});

module.exports = router;