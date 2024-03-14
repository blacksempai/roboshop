const getConnection = require('../db/connection');
const userService = require('./user.service');

async function createOrder(user_id, address){
    const db = await getConnection();
    const user = await userService.getUser(user_id);
    const newCart = await db.run('INSERT INTO cart DEFAULT VALUES');
    await db.run(`UPDATE user SET cart_id = ? WHERE id = ?`, newCart.lastID, user.id);
    await db.run(`INSERT INTO orders (status, user_id, cart_id,address) VALUES (?, ?, ?, ?)`, 'NEW', user.id, user.cart_id, address);
    db.close();
    return;
}

async function getAllByUserId(user_id){
    const db = await getConnection();
    const orders = await db.all('SELECT * FROM orders WHERE user_id = ?', user_id);  
    await Promise.all(
        orders.map(async o => {
            const items = await db.all(`
                SELECT p.name, cp.quantity, p.price FROM cart_product AS cp JOIN product AS p ON p.id = cp.product_id  
                WHERE cp.cart_id = ? 
            `, o.cart_id);
            o.items = items;
        })
    );
    db.close();
    return orders;
}

module.exports = {createOrder, getAllByUserId};