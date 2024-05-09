const getConnection = require("../db/connection");

async function getUser(id) {
    const db = await getConnection();
    const user = db.get('SELECT * FROM user WHERE id = ?', id);
    db.close();
    return user;
}

async function getAll() {
    const db = await getConnection();
    const users = db.all('SELECT id, login, phone, role, cart_id  FROM user');
    db.close();
    return users;
}

module.exports = {getUser, getAll};