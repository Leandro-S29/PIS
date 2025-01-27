const bcrypt = require('bcryptjs');
const pool = require('../config/db.js');
const saltRounds = require('../config/settings.json').auth.saltRounds;

class User {
    // User constructor
    constructor(id, username, password, email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // Convert a user from the database to a user 
    static fromDBtoUser(dbUser) {
        return new User(dbUser.user_id, dbUser.username, null, dbUser.email);
    }

    // Login a user
    async login() {
        if (!this.username || !this.password) {
            return { status: 400, result: { msg: 'Please provide a valid username and password' } };
        }
        try {
            const [dbUsers] = await pool.query('SELECT * FROM users WHERE username=?', [this.username]);
            if (!dbUsers.length) {
                return { status: 404, result: { msg: 'User not found' } };
            }
            const user = dbUsers[0];
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

    // Register a user
    async register() {
        if (!this.username || !this.password || !this.email) {
            return { status: 400, result: { msg: 'Please provide a username, password, and email' } };
        }
        try {
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);
            const [result] = await pool.query(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                [this.username, hashedPassword, this.email]
            );
            return { status: 201, result: { msg: 'User registered successfully', userId: result.insertId } };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // Check if a user exists
    static async checkExistence(username, email) {
        try {
            const [dbUsers] = await pool.query(
                'SELECT * FROM users WHERE username=? OR email=?',
                [username, email]
            );
            return dbUsers.length > 0;
        } catch (err) {
            console.error('Error checking user existence:', err);
            return false;
        }
    }

    // Get all users
    static async getAll() {
        try {
            const [dbUsers] = await pool.query('SELECT * FROM users');
            return dbUsers;
        } catch (err) {
            console.error('Error getting all users:', err);
            return [];
        }
    }
    //Delete user by id
    static async deleteById(userId) {
        try {
            const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
            return result;
        } catch (err) {
            console.error('Error deleting user:', err);
            throw err;
        }
    }

    // Update user by id
    static async updateById(userId, username, email) {
        try {
            const [result] = await pool.query('UPDATE users SET username = ?, email = ? WHERE user_id = ?', [username, email, userId]);
            return result;
        } catch (err) {
            console.error('Error updating user:', err);
            throw err;
        }
    }
}

module.exports = User;