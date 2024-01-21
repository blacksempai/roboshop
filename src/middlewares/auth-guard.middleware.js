const jwt = require('jsonwebtoken');

function authGuard(req, res, next) {
    const {token} = req.cookies;

    if(!token) {
        return res.status(401).send({message: 'Login Please'});
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_key';

    const isValid = jwt.verify(token, JWT_SECRET);

    if(!isValid) {
        res.clearCookie('token');
        return res.status(401).send({message: 'Token is invalid'});
    }

    const user = jwt.decode(token, JWT_SECRET);

    req.user = user;

    next();
}

module.exports = authGuard;