const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const bcrypt = require('bcrypt'); 
const jsw = require('jsonwebtoken');

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

router.post('/register', async (req, res) => {
    const login = req.body.login.trim();
    const password = req.body.password.trim();
    const phone = req.body.phone.trim();
 
    if(!login || !password || !phone) {
        return res.status(400).send({message: 'Please fill all required fields (login, password, phone)'});
    }

    if(!EMAIL_REGEX.test(login)) {
        return res.status(400).send({message: 'Email is invalid'});
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
    const login = req.body.login.trim();
    const password = req.body.password.trim();

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

    if(candidate.is_banned) {
        return res.status(401).send({message: 'Your account is BANNED'});
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_key';

    const token = jsw.sign({id: candidate.id}, JWT_SECRET);

    res.cookie('token', token);
    
    return res.status(200).send({token, message: 'You have successfuly loged in'});
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});

module.exports = router;