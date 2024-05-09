const getConnection = require('../db/connection');

async function getAll() {
    const db = await getConnection();
    const suppliers = await db.all('SELECT * FROM supplier');
    db.close();
    return suppliers;
}

async function edit(id, supplier) {
    const db = await getConnection();
    const result = await db.run('UPDATE supplier SET name = ?, address = ?, contact = ? WHERE id = ?', supplier.name, supplier.address, supplier.contact, id);
    db.close();
    return result;
}

async function save(supplier) {
    const db = await getConnection();
    const result = await db.run('INSERT INTO supplier (name, address, contact) VALUES(?, ?, ?)', supplier.name, supplier.address, supplier.contact);
    db.close();
    return result;
}
module.exports = {getAll, edit, save};