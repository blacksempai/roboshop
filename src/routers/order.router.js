const express = require('express');
const router = express.Router();
const orderService = require(`../services/order.service`);

router.post('', async function (req, res){
    await orderService.createOrder(req.user.id, req.body.address);

    res.status(201).send();
})

module.exports = router;