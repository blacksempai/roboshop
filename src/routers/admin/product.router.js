const express = require('express');
const router = express.Router();

router.post("", async (req, res) => {
    const product = req.body;
    console.log(product);
    return res.status(201).send();
})

module.exports = router;