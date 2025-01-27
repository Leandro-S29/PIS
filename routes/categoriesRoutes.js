const express = require('express');
const router = express.Router();
const Category = require('../models/categoriesModels');

// Allow self-signed certificates for HTTPS requests
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Fetch categories from the database
router.get('/', async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ msg: err.message });
    }
});

// Fetch categories from the API and add new ones to the database
router.get('/update', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        if (!response.ok) {
            throw new Error('Failed to fetch categories from API');
        }
        const data = await response.json();
        await Category.updateFromAPI(data.categories);
        res.json({ msg: 'Categories updated successfully' });
    } catch (err) {
        console.error('Error updating categories from API:', err);
        res.status(500).json({ msg: err.message });
    }
});

// Add a new category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        console.log('Adding category:', name);
        await Category.add(name);
        res.json({ msg: 'Category added successfully' });
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500).json({ msg: err.message });
    }
});

// Update an existing category
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        console.log('Updating category:', id, name);
        await Category.update(id, name);
        res.json({ msg: 'Category updated successfully' });
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ msg: err.message });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting category:', id);
        await Category.delete(id);
        res.json({ msg: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;