const getConnection = require('../db/connection');

async function getAll() {
    const db = await getConnection();
    const suppliers = await db.all('SELECT * FROM supplier');
    db.close();
    return suppliers;
}

module.exports = {getAll};