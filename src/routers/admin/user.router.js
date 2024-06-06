const express = require('express');
const router = express.Router();
const userService = require('../../services/user.service');

router.get('', async (req, res) => {
    return res.send(await userService.getAll())
});

router.patch('/:id/role', async (req, res) => {
    try {
        const {id} = req.params;
        const {role} = req.body;
        if(!id || !role) {
            return res.status(400).send({message: 'Bad request'})
        }
        if(id == req.user.id) {
            return res.status(401).send({message: 'Can not edit yourself'})
        }
        await userService.changeRole(id, role)
        return res.status(200).send();
    } catch(e) {
        return res.status(500).send(e)
    }
})

module.exports = router;