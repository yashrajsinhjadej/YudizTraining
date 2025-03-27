const express = require ('express')
const app = express()
const path = require('path')


app.get('/static',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','index.html'))
})



app.listen(3000,()=>{
    console.log('server is running on port 3000')
})


