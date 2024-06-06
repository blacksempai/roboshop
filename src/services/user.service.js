const getConnection = require("../db/connection");

const AVAILABLE_ROLES = ['USER', 'ADMIN'];

async function getUser(id) {
    const db = await getConnection();
    const user = db.get('SELECT * FROM user WHERE id = ?', id);
    db.close();
    return user;
}

async function getAll() {
    const db = await getConnection();
    const users = db.all('SELECT id, login, phone, role, cart_id, is_banned  FROM user');
    db.close();
    return users;
}

async function changeRole(id, role) {
    if(!AVAILABLE_ROLES.includes(role)) {
        throw 'No such role';
    }
    const db = await getConnection();
    await db.run('UPDATE user SET role = ? WHERE id = ?', role, id);
    db.close();
}

async function ban(id) {
    const db = await getConnection();
    await db.run('UPDATE user SET is_banned = ((is_banned | 1) - (is_banned & 1)) WHERE id = ?', id);
    db.close();
}


module.exports = {getUser, getAll, changeRole, ban};