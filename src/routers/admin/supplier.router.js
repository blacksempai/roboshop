const express = require('express');
const router = express.Router();
const supplierService = require('../../services/supplier.service');

router.get('', async (req, res) => {
    const suppliers = await supplierService.getAll();
    res.send(suppliers);
})


module.exports = router;