// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModels');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = new User(null, username, password, email);
        const exists = await User.checkExistence(username, email);
        if (exists) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        let result = await user.register();
        res.status(result.status).json(result.result);
    } catch (err) {
        res.status(500).json({ msg: 'Registration failed', error: err });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = new User(null, username, password, null);
        let result = await user.login();
        if (result.status === 200) {
            // Save user session
            req.session.userId = result.result.user.user_id;
            req.session.username = result.result.user.username;
        }
        res.status(result.status).json(result.result);
    } catch (err) {
        res.status(500).json({ msg: 'Login failed', error: err });
    }
});

// Logout a user
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ msg: 'Logged out successfully.' });
});

// Check session
router.get('/session', (req, res) => {
    if (req.session.username) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// Get All Users
router.get('/', async (req, res) => {
    try {
        let users = await User.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to get users', error: err });
    }
});


module.exports = router;