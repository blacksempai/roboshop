const userService = require('../services/user.service');

function adminGuard(req, res, next){
    const userID = req.user.id;
    const user = userService.getUser(userID);

    if(user.role === 'USER') {
        return res.status(401).send({message: 'Ur role not liquid'});
    } 
    next();
}