const express = require('express');
const router = express.Router();
const productRouter = require('./product.router');
const authRouter = require('./auth.router');

router.use('/auth', authRouter);

router.use('/product', productRouter);

module.exports = router;