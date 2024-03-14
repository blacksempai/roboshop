const express = require('express');
const router = express.Router();
const orderService = require(`../services/order.service`);

router.post('', async function (req, res){
    await orderService.createOrder(req.user.id, req.body.address);

    res.status(201).send();
})

router.get('', async function (req, res){
    const orders = await orderService.getAllByUserId(req.user.id)

    res.send(orders)
})

module.exports = router;