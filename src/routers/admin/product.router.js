const express = require('express');
const router = express.Router();
const productService = require('../../services/product.service');

router.post("", async (req, res) => {
    const product = req.body;
    
    if(!product.name || !product.price || !product.description || !product.quantity) {
        return res.status(400).send({message: 'Введіть всі необхідні поля!'})
    }

    const result = await productService.save(product);

    return res.status(201).send(result);
})

module.exports = router;