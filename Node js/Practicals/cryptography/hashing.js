const express = require('express')  
const bcrypt = require('bcrypt'); //for hashing the password
const app= express()

app.use(express.json())

app.post('/hash',async (req,res)=>{
    console.log(req.body)
    const {name,password}=req.body
    const hashedpasswrod = await bcrypt.hash(password,0)  //here 10 is salt rounds which is random so two user can not have same hash
    res.send(hashedpasswrod)
})


app.listen(3000,()=>{
    console.log("server started at port 3000")
})