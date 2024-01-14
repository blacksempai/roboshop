const getConnection = require('../db/connection');

async function isUserExists(login) {
    const db = await getConnection();
    const candidate = await db.get('SELECT * FROM user WHERE login = ?', login);
    db.close();
    return !!candidate;
}

async function registerUser(login, hashedPassword, phone) {
    const db = await getConnection();
    const cart = await db.run('INSERT INTO cart DEFAULT VALUES');
    const result = await db.run('INSERT INTO user (login, password, phone, cart_id) VALUES (?,?,?,?)', login, hashedPassword, phone, cart.lastID);
    db.close();
    return result.lastID;
}

module.exports = {isUserExists, registerUser};