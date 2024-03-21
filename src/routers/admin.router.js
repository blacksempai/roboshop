const express = require('express');
const router = express.Router();
const orderRouter = require('./admin/order.router');

router.use('/order', orderRouter);

module.exports = router;