const handleroutes= require('./routes/route');
const http = require('http');


const server = http.createServer((req,res)=>{
  handleroutes.handleRoutes(req,res);  
})

server.listen(3000,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('server is running on port 3000')
        console.log('http://localhost:3000/')
    }
})