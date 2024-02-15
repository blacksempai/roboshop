const getConnection = require('../db/connection');

async function getAll() {
    const db = await getConnection();
    const products = await db.all('SELECT * FROM product');
    await db.close();
    return products;
}

async function getOneById(id) {
    const db = await getConnection();
    const product = await db.get(
        'SELECT *,s.name AS supplier_name, p.name AS name FROM product AS p JOIN supplier AS s ON p.supplier_id=s.id WHERE p.id=?'
        ,id);
    await db.close();
    return product;
}


module.exports = {getAll, getOneById}