//BASE URL - /api/product
const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');

router.get('', async (req, res) => {
    try {
        const products = await productService.getAll();
        res.send(products);
    }
    catch(e) {
        res.status(500).end();
    }
});


module.exports = router;