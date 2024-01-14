const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const bcrypt = require('bcrypt'); 

router.post('/register', async (req, res) => {
    const {login, password, phone} = req.body;

    if(!login || !password | !phone) {
        return res.status(400).send({message: 'Please fill all required fields (login, password, phone)'});
    }

    if(await authService.isUserExists(login)) {
        return res.status(400).send({message: 'User with such login is already exists'});
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await authService.registerUser(login, hashedPassword, phone);

    if(result === undefined) {
        return res.status(500).send({message: 'Unknown error'});
    }

    return res.status(201).send({message: 'Account has been successfully created'});
});

module.exports = router;