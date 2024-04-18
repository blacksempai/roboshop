const getConnection = require('./connection');

const doMigration = async () => {
    const db = await getConnection();
    await db.run(`
        CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY)
    `);
    await db.run(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY, 
            login TEXT NOT NULL UNIQUE, 
            password TEXT NOT NULL, 
            phone TEXT, 
            role TEXT CHECK(role IN ('USER','ADMIN')) NOT NULL DEFAULT 'USER',
            cart_id INTEGER UNIQUE NOT NULL, 
            FOREIGN KEY (cart_id) REFERENCES cart(id)
        )
    `);
    await db.run(`
        CREATE TABLE IF NOT EXISTS supplier (
            id INTEGER PRIMARY KEY, 
            name TEXT NOT NULL,
            address TEXT,
            contact TEXT
        )
    `);
    await db.run(`
        CREATE TABLE IF NOT EXISTS product (
            id INTEGER PRIMARY KEY, 
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price INTEGER NOT NULL,
            description TEXT NOT NULL,
            supplier_id INTEGER,
            photo_url TEXT,
            FOREIGN KEY (supplier_id) REFERENCES supplier(id)
        )
    `);
    //TODO: зберігати також ціну продукту
    await db.run(`
        CREATE TABLE IF NOT EXISTS cart_product (
            id INTEGER PRIMARY KEY, 
            product_id INTEGER NOT NULL, 
            cart_id INTEGER NOT NULL, 
            quantity INTEGER NOT NULL, 
            FOREIGN KEY (cart_id) REFERENCES cart(id), 
            FOREIGN KEY (product_id) REFERENCES product(id)
        )
    `);
    await db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY, 
            status TEXT NOT NULL, 
            user_id INTEGER NOT NULL, 
            cart_id INTEGER NOT NULL, 
            address TEXT NOT NULL, 
            FOREIGN KEY (user_id) REFERENCES user(id), 
            FOREIGN KEY (cart_id) REFERENCES cart(id)
        )
    `);
    await db.close();
    console.log('DB is ready!');
}

module.exports = doMigration;