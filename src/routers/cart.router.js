const express = require('express');
const router = express.Router();

router.post('', (req, res) => {
    const {id} = req.body;

    if(!id) {
        return res.status(400).send({message: 'Specify product please'});
    }

    console.log(req.user);

    //. . .

    return res.status(201).send({message: 'Product have been added to cart'});
});

module.exports = router;