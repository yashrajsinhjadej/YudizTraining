const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/post',(req,res)=>{
    // console.log(typeof req.body)
    const { sName } = req.body;
    res.send(sName)
})

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})



