const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 50,
        required: true
    },
    password: {
        type: String,
        min: 5,
        max: 50,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    }
})

userSchema.methods.generateToken=function () {
    const token=jwt.sign({_id:this._id,username:this.username,email:this.email},'12345me')
    return token;
}

const User=mongoose.model('user',userSchema);

function validateUser(req) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().required()
    })
    return schema.validate(req)
}

module.exports={ User, validateUser };