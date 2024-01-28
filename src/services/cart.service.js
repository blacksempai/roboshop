const getConnection = require("../db/connection");


async function getCart(id) {
    const db = await getConnection();
    const cart = await db.all(`
    SELECT cp.quantity, p.id, p.name, p.price, p.photo_url 
    FROM cart_product as cp LEFT JOIN product as p ON cp.product_id = p.id 
    WHERE cp.cart_id = ?`, id);
    db.close();
    return cart;
}

async function addProductToCart(cart_id, product_id) {
    const db = await getConnection();

    const candidate = await db.get(`
        SELECT * FROM cart_product WHERE cart_id = ? AND product_id = ?
    `, cart_id, product_id);

    if(candidate) {
        await db.run(
            `UPDATE cart_product SET quantity = ? WHERE id = ?`,candidate.quantity + 1, candidate.id
        );
    }
    else {
        await db.run(`INSERT INTO cart_product (cart_id, product_id, quantity) VALUES (?,?,?)`,
        cart_id, product_id, 1);
    }

    db.close();
    return;
} 

module.exports = {getCart, addProductToCart};