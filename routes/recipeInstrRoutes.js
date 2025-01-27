const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const Ingredient = require('../models/recipeInstrModels');

router.get('/:recipe_id', async (req, res) => {
    try {
        const recipe_id = req.params.recipe_id;
        const Instrutcions = await Ingredient.getAllbyrecipe(recipe_id);
        res.json(Instrutcions);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get Instrutcions', error: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const {instruction_id, recipe_id, step_number, instruction } = req.body;
        const [result] = await pool.query('INSERT INTO recipe_instructions (instruction_id, recipe_id, step_number, instruction) VALUES (?, ?, ?, ?)', [instruction_id, recipe_id, step_number, instruction]);
        res.json({ msg: 'Instrutcion added successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to add Instrutcion', error: err });
    }
});

router.put('/:instruction_id', async (req, res) => {
    try {
        const instruction_id = req.params.instruction_id;
        const {instruction} = req.body; // Obtendo o valor atualizado

        const [result] = await pool.query(
            'UPDATE recipe_instructions SET instruction = ? WHERE instruction_id = ? ',
            [instruction, instruction_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Instrutcion not found' });
        }

        res.json({ msg: 'Instrutcion updated successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to update Instrutcion', error: err });
    }
});


router.delete('/:instruction_id', async (req, res) => {
    try {
        const instruction_id = req.params.instruction_id;
        const [result] = await pool.query('DELETE FROM recipe_instructions WHERE instruction_id = ? ',
            instruction_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Instrutcion not found' });
        }
        res.json({ msg: 'instruction deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete Instrutcion', error: err });
    }
});

module.exports = router;