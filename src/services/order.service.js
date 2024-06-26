const getConnection = require('../db/connection');
const userService = require('./user.service');

async function createOrder(user_id, address){
    const db = await getConnection();
    const user = await userService.getUser(user_id);
    const cartProducts = await db.all(
        'SELECT cp.id, cp.product_id, cp.quantity FROM user AS u JOIN cart_product AS cp ON u.cart_id = cp.cart_id WHERE u.id = ?',
        user_id
    );
    if(!cartProducts.length) {
        throw new Error('Can not create order with empty cart!');
    }
    await Promise.all(cartProducts.map(async cp => {
        const p = await db.get('SELECT id, price, quantity FROM product WHERE id = ?', cp.product_id);
        await db.run('UPDATE cart_product SET price = ? WHERE id = ?', p.price, cp.id);
        if(p.quantity < cp.quantity) {
            throw new Error('Not enough product on the warehouse');  
        }
        await db.run('UPDATE product SET quantity = ? WHERE id = ?', p.quantity - cp.quantity, p.id);
    }));
    const newCart = await db.run('INSERT INTO cart DEFAULT VALUES');
    await db.run(`UPDATE user SET cart_id = ? WHERE id = ?`, newCart.lastID, user.id);
    await db.run(`INSERT INTO orders (status, user_id, cart_id,address, create_date) VALUES (?, ?, ?, ?, ?)`, 'NEW', user.id, user.cart_id, address, new Date().toISOString());
    db.close();
    return;
}

async function getAllByUserId(user_id){
    const db = await getConnection();
    const orders = await db.all('SELECT * FROM orders WHERE user_id = ?', user_id);  
    await Promise.all(
        orders.map(async o => {
            const items = await db.all(`
                SELECT p.name, cp.quantity, cp.price FROM cart_product AS cp JOIN product AS p ON p.id = cp.product_id  
                WHERE cp.cart_id = ? 
            `, o.cart_id);
            o.items = items;
        })
    );
    db.close();
    return orders;
}

async function getAll() {
    const db = await getConnection();
    const orders = await db.all('SELECT o.*, u.login, u.phone FROM orders AS o JOIN user AS u ON o.user_id == u.id');  
    await Promise.all(
        orders.map(async o => {
            const items = await db.all(`
                SELECT p.name, cp.quantity, cp.price FROM cart_product AS cp JOIN product AS p ON p.id = cp.product_id  
                WHERE cp.cart_id = ? 
            `, o.cart_id);
            o.items = items;
        })
    );
    db.close();
    return orders;
}

async function changeStatus(id, status) {
    const db = await getConnection();
    const order = await db.get('SELECT * FROM orders WHERE id = ?', id);
    if(order.status === 'DONE' || order.status === 'CANCELED') {
        throw new Error('This order status can not be changed!');
    }
    if(status === 'NEW') {
        throw new Error('Can not change status to NEW');
    }
    await db.run('UPDATE orders SET status = ?, edit_date = ? WHERE id = ?', status, new Date().toISOString(), id);

    if(status === 'CANCELED') {
        const cartProducts = await db.all('SELECT * FROM cart_product WHERE cart_id = ?', order.cart_id);
        await Promise.all(cartProducts.map(async cp => {
            await db.run('UPDATE product SET quantity = quantity + ? WHERE id = ?', cp.quantity, cp.product_id);
        }));
    }

    db.close();
}

module.exports = {createOrder, getAllByUserId, getAll, changeStatus};