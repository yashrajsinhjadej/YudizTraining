const express = require('express')
const multer = require('multer')
const app = express()

var store = multer.diskStorage({
    destination:"single",
    filename: function (req, file, cb) {
    cb(null, file.originalname)
    }
    })
    var upload = multer({ storage: store })    
app.use('/file',express.static('public'))

app.post('/uploadfile',upload.single('mypic'),(req,res)=>{
    const file = req.file
if (file) {
res.send("file uploaded successfully")
}
})


app.listen(3000,(err)=>{
    if(err){
        console.log('there was an error')
    }
    else{
        console.log('server is running on 3000 ')
    }
})