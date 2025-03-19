### Static Files

**Definition:** Static files are unchanging assets, like HTML, CSS, JavaScript, images, and videos, that are delivered to a user's web browser exactly as they are stored on a server without any server-side processing or dynamic content generation.

**Benefits of Using Static Files:**

- **Improved Load Times:** Static files can be cached in the user's browser, reducing load times.
- **Better User Experience:** Faster load times and reduced server load contribute to a better overall user experience.

**Examples:**

// Node.js serving HTML file

// File name is temp.html and it is in the same directory as this file
```
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
```

