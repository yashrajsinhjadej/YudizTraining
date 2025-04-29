const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { data, jwdvalidate } = require("./utils");

app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password, isauth } = req.body;
  console.log(data);
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }
  const user = data.find((user) => user.username == username);
  if (!user) {
    return res.status(400).send("User not found");
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid password");
  }
  const token = jwt.sign({ user: username }, "Yashrajsinh-Jadeja", {
    expiresIn: "1h",
  });
  console.log(token);
  res.status(200).json({ token });
});

app.get("/level1", (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //this will give us token
    if (!token) {
      res.send("no token found");
    } else {
      const validateddata = jwdvalidate(res, token);
      const user = data.find((obj)=>{return validateddata.user==obj.username})
      console.log(user);
      res.send('every person who is logged in can see this level');
    }
});

app.get("/level2", (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //this will give us token
    if (!token) {
      res.send("no token found");
    } else {
      const validateddata = jwdvalidate(res, token);
      const user = data.find((obj)=>{return validateddata.user==obj.username})
      if(!( user.auth=='client')){
      res.send('admin and owner can see this changes');}
      else{
          res.send('not authorised')
      }
    }
});

app.get("/level3", (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; //this will give us token
    if (!token) {
      res.send("no token found");
    } else {
      const validateddata = jwdvalidate(res, token);
      const user = data.find((obj)=>{return validateddata.user==obj.username})
      console.log(user);
      if(user.auth=='Owner'){
      res.send('owner can see this changes');}
      else{
          res.send('not authorised')
      }
    }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
