const path = require('path');
const http = require('http');
const ejs = require('ejs');

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url == '/') {
        const filename = path.join(__dirname, 'views', 'index.ejs');
        ejs.renderFile(filename, { name: "Rishi Meet" }, (err, str) => {
            if (err) {
                console.error('EJS Render Error:', err);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('There was an error rendering the file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(str);
            }
        });
    } else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('File not found');
    }
});

server.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server running on port 3000');
    }
});