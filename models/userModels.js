// models/userModels.js
const bcrypt = require('bcryptjs');
const pool = require('../config/db.js');
const saltRounds = require('../config/settings.json').auth.saltRounds;

class User {
    constructor(id, username, password, email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    static fromDBtoUser(dbUser) {
        return new User(dbUser.user_id, dbUser.username, null, dbUser.email);
    }

    // Get user by username
    async login() {
        if (!this.username || !this.password) {
            return { status: 400, result: { msg: 'Please provide a valid username and password' } };
        }
        try {
            let [dbUsers] = await pool.query('SELECT * FROM users WHERE username=?', [this.username]);
            if (!dbUsers.length) {
                return { status: 404, result: { msg: 'User not found' } };
            }
            let user = dbUsers[0];
            const match = await bcrypt.compare(this.password, user.password);
            if (match) {
                return { status: 200, result: { msg: 'Login successful', user: user } };
            } else {
                return { status: 401, result: { msg: 'Invalid password' } };
            }
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // Register a new user
    async register() {
        if (!this.username || !this.password || !this.email) {
            return { status: 400, result: { msg: 'Please provide a username, password, and email' } };
        }
        try {
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);
            let [result] = await pool.query(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                [this.username, hashedPassword, this.email]
            );
            return { status: 201, result: { msg: 'User registered successfully', userId: result.insertId } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // Check if a user exists by username or email
    static async checkExistence(username, email) {
        try {
            let [dbUsers] = await pool.query(
                'SELECT * FROM users WHERE username=? OR email=?',
                [username, email]
            );
            return dbUsers.length > 0;
        } catch (err) {
            console.error('Error checking user existence:', err);
            return false;
        }
    }

    // Get All Users
    static async getAll() { 
        try {
            let [dbUsers] = await pool.query('SELECT * FROM users');
            return dbUsers;
        } catch (err) {
            console.error('Error getting all users:', err);
            return [];
        }
    }
    

}

module.exports = User;