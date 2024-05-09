const express = require('express');
const router = express.Router();
const supplierService = require('../../services/supplier.service');

router.get('', async (req, res) => {
    const suppliers = await supplierService.getAll();
    res.send(suppliers);
})

router.post('', async (req, res) => {
    const supplier = req.body;

    if(!supplier.name || !supplier.address || !supplier.contact) {
        return res.status(400).send({message: 'Введіть всі необхідні поля!'})
    }
    const result = await supplierService.save(supplier);
    return res.status(201).send(result);
})

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const supplier = req.body;
    
    if(!supplier.name || !supplier.address || !supplier.contact) {
        return res.status(400).send({message: 'Введіть всі необхідні поля!'})
    }

    await supplierService.edit(id, supplier);
    return res.status(204).end();
})


module.exports = router;