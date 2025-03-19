// Node js serving html file
//file name is temp.html 
// and it is in the same directory as this file
const fs = require('fs')
const http = require('http')
const path = require('path')
const obj = {'js':'text/javascript','html':'text/html','css':'text/css','png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','gif':'image/gif','svg':'image/svg+xml','ico':'image/x-icon'}
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url === '/' ? 'temp.html' : req.url);
    extname=path.extname(filePath)
    let contentType=obj.extname // to get the content type of the file 
    fs.readFile(filePath,(err,data)=>{
        if(err){ //if file not found 
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('<h1>404 Not Found</h1>');
            console.log('Error:', err.message);
            res.end()
        }
        else{
            res.writeHead(200,{'Content-Type':contentType})
            res.write(data);
            res.end();
        }
    })
});
server.listen(3000, () => 
    {
        console.log('Server is running on port 3000','http://localhost:3000')
    });
x