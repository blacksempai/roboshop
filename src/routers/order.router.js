const express = require('express');
const router = express.Router();
const orderService = require(`../services/order.service`);

router.post('', async function (req, res){
    try {
        await orderService.createOrder(req.user.id, req.body.address);
        //TODO: Додати перевірку на дублі замовлень*
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

router.get('', async function (req, res){
    const orders = await orderService.getAllByUserId(req.user.id)
    res.send(orders)
})

module.exports = router;