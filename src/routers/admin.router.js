const express = require('express');
const router = express.Router();
const orderRouter = require('./admin/order.router');
const productRouter = require('./admin/product.router');

router.use('/order', orderRouter);
router.use('/product', productRouter);


module.exports = router;