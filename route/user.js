const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser }  = require('../model/users')
const express = require('express')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('This email already exist')

    const salt = await bcrypt.genSalt(15)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
    })

    await newUser.save()
    const token = newUser.generateToken();
    res.header('auth-token', token).status(200).send(_.pick(newUser, ['username', 'email']))
})

module.exports = router