const express = require('express');
const cartService = require('../services/cart.service');
const router = express.Router();

router.get('', async (req, res) => {
    const {cart_id} = req.user;
    const cart = await cartService.getCart(cart_id);
    if(!cart) {
        return res.status(500).send({message: 'Cart with such id doesn\'t exists'});
    }
    return res.send(cart);
});

router.put('/item', async (req, res) => {
    const {product_id} = req.body;
    const {cart_id} = req.user;

    if(!product_id) {
        return res.status(400).send({message: 'Specify product please'});
    }

    await cartService.addProductToCart(cart_id, product_id);

    return res.status(201).send({message: 'Product have been added to cart'});
});

router.delete('/item/:product_id', async (req, res) => {
    try{
        const {product_id} = req.params;
        const {cart_id} = req.user;
        await cartService.deleteProductFromCart(cart_id, product_id);
        return res.status(204).end();
    }
    catch(e){
        return res.status(500).send({message: e})
    }
});

module.exports = router;