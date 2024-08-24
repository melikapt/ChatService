const { Message, validateMessage } = require('../model/message');
const auth = require('../middleware/auth')
const _ = require('lodash');
const { User } = require('../model/users');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validateMessage(req.body);
    
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findById({ _id: req.user._id })
    if (!user) return res.status(404).send(`user doesn't exist`)

    const message = new Message({
        message: req.body.message,
        sender: {
            _id: user._id,
            username: user.username,
            email: user.email
        },
        createdAt:Date.now()
    })
    await message.save()

    res.status(200).send(_.pick(message, ['message', 'username']))
})

router.get('/',auth,async(req,res)=>{
    const messages=await Message.find()
    .select('message sender.username sender.email -_id')

    res.status(200).send(messages);
})

module.exports = router;