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
            is_banned INTEGER NOT NULL DEFAULT 0 CHECK(is_banned IN (0,1)),
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
    //TODO add sale field
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
    await db.run(`
        CREATE TABLE IF NOT EXISTS cart_product (
            id INTEGER PRIMARY KEY, 
            product_id INTEGER NOT NULL, 
            cart_id INTEGER NOT NULL, 
            quantity INTEGER NOT NULL, 
            price INTEGER,
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
            create_date DATETIME,
            edit_date DATETIME,
            FOREIGN KEY (user_id) REFERENCES user(id), 
            FOREIGN KEY (cart_id) REFERENCES cart(id)
        )
    `);
    await db.close();
    console.log('DB is ready!');
}

module.exports = doMigration;