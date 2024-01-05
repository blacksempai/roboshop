const {AsyncDatabase} = require('promised-sqlite3');

function getConnection() {
    return AsyncDatabase.open('./src/db/shop.db');
}

module.exports = getConnection;