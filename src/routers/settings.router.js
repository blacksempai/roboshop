const express = require('express');
const userService = require('../services/user.service');
const router = express.Router();

router.get('/is-admin', async (req, res) => {
    const userId = req.user.id;
    const user = await userService.getUser(userId);
    res.send({isAdmin: user.role === 'ADMIN'});
});

module.exports = router;