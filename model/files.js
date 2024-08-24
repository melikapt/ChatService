const { required } = require('joi');
const mongoose=require('mongoose');


const fileSchema=new mongoose.Schema({
    originalTitle:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    uploader:{
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

const File=mongoose.model('file',fileSchema);

module.exports=File;