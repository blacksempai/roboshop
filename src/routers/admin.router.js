const express = require('express');
const router = express.Router();
const orderRouter = require('./admin/order.router');
const productRouter = require('./admin/product.router');
const supplierRouter = require('./admin/supplier.router');
const userRouter = require('./admin/user.router');

router.use('/order', orderRouter);
router.use('/product', productRouter);
router.use('/supplier', supplierRouter);
router.use('/user', userRouter);

module.exports = router;