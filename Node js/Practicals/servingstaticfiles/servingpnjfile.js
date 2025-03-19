 const path = require('path')
 const fs=require('fs')
 const http=require('http')

 const server=http.createServer((req,res)=>{
    const pathname=path.join(__dirname,req.url === '/'?'yash.jpeg':req.url)
    // const extname=path.extname(pathname)

    fs.readFile(pathname,(err,data)=>
        {
            if(err){
                res.writeHead(404,{'Content-Type':'text/html'})
                res.write('<h1>404 Not Found</h1>')
                console.log('Error:',err.message)
                res.end()
            }
            else{
                // res.writeHead(200,{'Content-Type':'text/html'})
                res.write(data)
                res.end()
            }
        });


 })
 server.listen(3000,()=>
    {
        console.log('Server is running on port 3000','http://localhost:3000')
    });