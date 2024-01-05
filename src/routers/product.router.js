//BASE URL - /api/product
const express = require('express');
const getConnection = require('../db/connection');
const router = express.Router();

router.get('', async (req, res) => {
    try {
        const db = await getConnection();
        const products = await db.all('SELECT * FROM product');
        await db.close();
        res.send(products);
    }
    catch(e) {
        res.status(500).end();
    }
})


module.exports = router;