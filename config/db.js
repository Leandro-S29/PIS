const mysql = require("mysql2/promise");
const settings = require("./settings.json").database;

const pool = mysql.createPool(settings);

module.exports = pool;
