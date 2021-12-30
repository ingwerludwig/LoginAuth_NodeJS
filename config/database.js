require('dotenv').config()
const mysql = require('mysql')

const optionForSession = {
    host: process.env.HOST,
    user: 'root',
    database: process.env.DATABASE,
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 100
}

const pool = mysql.createPool(optionForSession);

module.exports.pool=pool;
module.exports.optionForSession=optionForSession