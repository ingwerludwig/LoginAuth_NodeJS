const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const pool = require('../config/database').pool;
const option = require('../config/database').optionForSession

exports.storeSession = () => {
    let sessionStore = new MySQLStore(option,pool);
    return sessionStore
}