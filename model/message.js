const Joi = require('joi');
const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    sender:{
        type:new mongoose.Schema({
            username: {
                type: String,
                min: 3,
                max: 50,
                required: true
            },
            email: {
                type: String,
                required: true
            }
        }),
        required:true
    },
    createdAt:{
        type:Date
    }
})

const Message=mongoose.model('message',messageSchema);

function validateMessage(message) {
    const schema = Joi.object({
        message: Joi.string().required(),
    })
    return schema.validate(message)
}

module.exports={ Message, validateMessage };
