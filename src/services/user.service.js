const getConnection = require("../db/connection");

async function getUser(id) {
    const db = await getConnection();
    const user = db.get('SELECT * FROM user WHERE id = ?', id);
    db.close();
    return user;
}

module.exports = {getUser};