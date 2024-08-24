const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth=require('../middleware/auth');
const File=require('../model/files')

const storage = multer.diskStorage({
    destination: function(req, file, cb)  {
        cb(null, process.cwd() + `/uploadedFiles`)
    },
    filename: function(req, file, cb)  {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})


const upload=multer({storage:storage});

router.post('/upload',[auth,upload.single('file')] ,async (req, res) => { 
    try {
        const newFile=new File({
            originalTitle:req.file.originalname,
            title:req.file.filename,
            uploader:{
                _id:req.user._id,
                username:req.user.username,
                email:req.user.email
            },
            createdAt:Date.now()
        })
        await newFile.save()

        res.status(200).send({message:`${newFile.uploader.username} uploaded a file successfully`,fileName:req.file.filename})
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/',auth,async(req,res)=>{
    const files=await File.find()
    .select('title uploader.username -_id')

    res.status(200).send(files);
})

module.exports=router;