// Node js serving html file
//file name is temp.html 
// and it is in the same directory as this file
const fs = require('fs')
const http = require('http')
const path = require('path')

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url === '/' ? 'temp.html' : req.url);
    extname=path.extname(filePath)
    console.log('extname',extname)
    console.log('filePath',filePath)
    fs.readFile(filePath,(err,data)=>{
        if(err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('<h1>404 Not Found</h1>');
            console.log('Error:', err.message);
            res.end()
        }
        else{
            res.writeHead(200,{'Content-Type':'text/html'})
            res.write(data);
            res.end();
        }
    })
});
server.listen(3000, () => 
    {
        console.log('Server is running on port 3000','http://localhost:3000')
    });

const STATIC_PATH = path.join(__dirname, './static')
console.log(STATIC_PATH)