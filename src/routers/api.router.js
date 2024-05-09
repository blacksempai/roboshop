const express = require('express');
const router = express.Router();
const productRouter = require('./product.router');
const authRouter = require('./auth.router');
const cartRouter = require('./cart.router');
const orderRouter = require('./order.router');
const adminRouter = require('./admin.router');
const settingsRouter = require('../routers/settings.router');
const adminGuard = require('../middlewares/admin-guard.middleware');
const authGuard = require('../middlewares/auth-guard.middleware');

router.use('/auth', authRouter);

router.use('/product', productRouter);

router.use('/cart', authGuard, cartRouter);

router.use('/order', authGuard, orderRouter);

router.use('/settings', authGuard, settingsRouter);

router.use('/admin', authGuard, adminGuard, adminRouter);


module.exports = router;