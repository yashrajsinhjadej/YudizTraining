const express= require('express')
const app = express()
const path = require('path')


app.use(express.json())

app.get('/static',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','index.html'))
})  


app.put('/put',(req,res)=>{
    const { sName } = req.body;
    console.log(req.body)
    res.send(sName)
})

app.listen(3000,()=>{
    console.log('server is runnign in port 3000')
})