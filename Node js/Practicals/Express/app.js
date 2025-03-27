const express = require('express')
const app = express()


app.use('/',(req,res,next)=>{
  console.log('middleware')
  next()
})

app.get('/',(req,res)=>{
  res.send('Hello World')
})

app.listen(3000,()=>{
  console.log('Server is running on port 3000')
})


app.post('/user',(req,res)=>{
  console.log(req.body)
  user= req.body
  console.log(user)
  res.send('User Created')
})
app.use(express.json())