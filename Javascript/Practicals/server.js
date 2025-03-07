const http = require("http");

let users = [];  

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "POST" && req.url === "/users") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
            // console.log(chunk);
        });
  
        x

        req.on("end", () => {
            try {
                // console.log(body)   
                let userData = JSON.parse(body)
                // console.log('here')
                users.push(userData); 
                // console.log(users)
                res.writeHead(201);
                res.end(JSON.stringify({ message: "User Created", user: userData }));
            } catch (error) {
                res.writeHead(400);
                console.log(error)
                res.write(JSON.stringify(users))
                // res.end(JSON.stringify({ error: "Invalid JSON format" }));
                res.end('here ')
            }
        });

    } else if (req.method === "GET" && req.url.startsWith("/users/")) {
        const userId = parseInt(req.url.split("/")[2]);  // "users/2 = id 2"
        // console.log(userId)
        const user = users.find((user) => user.id === userId);

        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify({ message: "User Found", user }));
        } else {    
            res.writeHead(404);
            res.end(JSON.stringify({ error: "User Not Found" }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Invalid Route" }));
    }
});

server.listen(3000, () => {
    console.log("Server is Running at http://localhost:3000");
});
