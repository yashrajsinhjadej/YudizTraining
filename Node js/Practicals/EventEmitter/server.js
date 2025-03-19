const http = require('http');
const EventEmitter = require('events');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
  
    req.on('data',(chunk)=>{
        throw new Error('whoops');
    })
    req.on('end', () => {
        console.log('Request ended');
    });
    req.on('error',(err)=>{
        console.log(err);
    })
    res.end('Hello World\n');
});
server.listen(3000, () => {
    console.log('done')});