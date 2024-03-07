const express = require('express');
const cartService = require('../services/cart.service');
const userService = require('../services/user.service');
const router = express.Router();

router.get('', async (req, res) => {
    const {cart_id} = await userService.getUser(req.user.id);
    const cart = await cartService.getCart(cart_id);
    if(!cart) {
        return res.status(500).send({message: 'Cart with such id doesn\'t exists'});
    }
    return res.send(cart);
});

router.get('/count', async (req, res) => {
    const {cart_id} = await userService.getUser(req.user.id);
    const count = await cartService.getCount(cart_id);
    return res.send({count});
});

router.put('/item', async (req, res) => {
    const {product_id} = req.body;
    const {cart_id} = await userService.getUser(req.user.id);

    if(!product_id) {
        return res.status(400).send({message: 'Specify product please'});
    }

    await cartService.addProductToCart(cart_id, product_id);

    return res.status(201).send({message: 'Product have been added to cart'});
});

router.delete('/item/:product_id', async (req, res) => {
    try{
        const {product_id} = req.params;
        const {cart_id} = await userService.getUser(req.user.id);
        await cartService.deleteProductFromCart(cart_id, product_id);
        return res.status(204).end();
    }
    catch(e){
        return res.status(500).send({message: e})
    }
});

module.exports = router;