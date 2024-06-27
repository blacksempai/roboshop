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
        'SELECT *, p.id, s.name AS supplier_name, p.name AS name FROM product AS p LEFT JOIN supplier AS s ON p.supplier_id=s.id WHERE p.id=?'
        ,id);
    await db.close();
    return product;
}

async function save(product) {
    const db = await getConnection();
    const {name, quantity, price, description, supplier_id, photo_url} = product;
    const result = await db.run(
        `
        INSERT INTO product (name, quantity, price, description, supplier_id, photo_url)
        VALUES (?,?,?,?,?,?)
        `,
        name, quantity, price, description, supplier_id, photo_url
    );
    await db.close();
    return result;
}

async function edit(id, product) {
    const db = await getConnection();
    const {name, quantity, price, description, supplier_id, photo_url} = product;
    const result = await db.run(
        `
        UPDATE product SET name=?, quantity=?, price=?, description=?, supplier_id=?, photo_url=? 
        WHERE id=? 
        `,
        name, quantity, price, description, supplier_id, photo_url, id
    );

    await db.close();
    return result;
}

async function deleteById(id){
    const db = await getConnection();
    await db.run('DELETE FROM product WHERE id=?', id);

    await db.close();
}


module.exports = {getAll, getOneById, save, edit, deleteById}