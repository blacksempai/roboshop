const getConnection = require('../db/connection');

async function getAll() {
    const db = await getConnection();
    const products = await db.all('SELECT * FROM product');
    await db.close();
    return products;
}

module.exports = {getAll}