const userService = require('../services/user.service');

async function adminGuard(req, res, next){
    const userID = req.user.id;
    const user = await userService.getUser(userID);

    if(user.role !== 'ADMIN') {
        return res.status(401).send({message: 'Ur role not liquid'});
    } 
    next();
}

module.exports = adminGuard;