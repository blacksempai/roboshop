const express = require('express');
const router = express.Router();
const orderService = require('../../services/order.service');

router.get('', async (req, res) => {
    res.send(await orderService.getAll())
});

module.exports = router;