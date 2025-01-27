const pool = require('../config/db.js');

class Collection {
    // Get all collections
    static async getAll() {
        try {
            const [collections] = await pool.query('SELECT * FROM collections');
            return collections;
        } catch (err) {
            throw new Error('Failed to get collections');
        }
    }

    // Get collection by id
    static async getByUserId(userId) {
        try {
            const [collections] = await pool.query('SELECT * FROM collections WHERE user_id = ?', [userId]);
            return collections;
        } catch (err) {
            throw new Error('Failed to get collections');
        }
    }

    // Insert collection into database
    static async add(name, userId, description) {
        try {
            const [result] = await pool.query('INSERT INTO collections (name, user_id, description) VALUES (?, ?, ?)', [name, userId, description]);
            return result.insertId;
        } catch (err) {
            throw new Error('Failed to add collection');
        }
    }

    // Delete collection by id and all favorites
    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('DELETE FROM favorites WHERE collection_id = ?', [id]);
            await connection.query('DELETE FROM External_Favorites WHERE collection_id = ?', [id]);
            await connection.query('DELETE FROM collections WHERE collection_id = ?', [id]);
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw new Error('Failed to delete collection');
        } finally {
            connection.release();
        }
    }

    //Favorites
    // Get favorites by collection id
    static async getFavoritesByCollectionId(collectionId) {
        try {
            const [favorites] = await pool.query('SELECT * FROM collection_favorites WHERE collection_id = ?', [collectionId]);
            return favorites;
        } catch (err) {
            throw new Error('Failed to get favorites for collection');
        }
    }

    // Remove favorite from collection
    static async removeFavorite(collectionId, recipeId, isExternal) {
        try {
            if (isExternal) {
                await pool.query('DELETE FROM External_Favorites WHERE collection_id = ? AND external_recipe_id = ?', [collectionId, recipeId]);
            } else {
                await pool.query('DELETE FROM Favorites WHERE collection_id = ? AND recipe_id = ?', [collectionId, recipeId]);
            }
        } catch (err) {
            throw new Error('Failed to remove favorite from collection');
        }
    }

    // Add internal recipe to collection
    static async addFavorite(collectionId, recipeId) {
        try {
            await pool.query('INSERT INTO Favorites (collection_id, recipe_id) VALUES (?, ?)', [collectionId, recipeId]);
        } catch (err) {
            throw new Error('Failed to add favorite to collection');
        }
    }

    // Add external recipe to collection
    static async addExternalFavorite(collectionId, recipeId) {
        try {
            await pool.query('INSERT INTO External_Favorites (collection_id, external_recipe_id) VALUES (?, ?)', [collectionId, recipeId]);
        } catch (err) {
            throw new Error('Failed to add external favorite to collection');
        }
    }
}

module.exports = Collection;