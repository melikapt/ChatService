const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User } = require('../model/users')
const express = require('express')
const router = express.Router()


router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(401).send('Unauthorized!')

    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) return res.status(401).send('Unauthorized!')

    const token = user.generateToken()

    res.header('auth-token',token).status(200).send({token:token,username:user.username,email:user.email})
})

function validateUser(req) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(5).max(50).required()
    })
    return schema.validate(req)
}

module.exports = router