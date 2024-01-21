const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const bcrypt = require('bcrypt'); 
const jsw = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const {login, password, phone} = req.body;

    if(!login || !password || !phone) {
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

router.post('/login', async (req, res) => {
    const {login, password} = req.body;

    if(!login || !password) {
        return res.status(400).send({message: 'Please fill all required fields (login, password)'});
    }

    const candidate = await authService.getUserByLogin(login);

    if(!candidate) {
        return res.status(400).send({message: 'User with that login doesn\'t exists'});
    }

    const isPasswordsEqual = await bcrypt.compare(password, candidate.password);

    if(!isPasswordsEqual) {
        return res.status(401).send({message: 'Password is wrong'});
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_key';

    const token = jsw.sign({
        login: candidate.login,
        id: candidate.id, 
        cart_id: candidate.cart_id
    }, JWT_SECRET);

    res.cookie('token', token);
    
    return res.status(200).send({token, message: 'You have successfuly loged in'});
});

module.exports = router;