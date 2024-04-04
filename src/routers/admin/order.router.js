const express = require('express');
const router = express.Router();
const orderService = require('../../services/order.service');

router.get('', async (req, res) => {
    return res.send(await orderService.getAll())
});

// PATCH /api/admin/order/2
router.patch('/:id', async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    console.log(req.body)

    await orderService.changeStatus(id, status);

    return res.status(204).end();
})

module.exports = router;