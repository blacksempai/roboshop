const express = require('express');
const router = express.Router();
const userService = require('../../services/user.service');

router.get('', async (req, res) => {
    return res.send(await userService.getAll())
});

module.exports = router;