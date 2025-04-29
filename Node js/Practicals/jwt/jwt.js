const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { data, jwdvalidate } = require("./utils");
class User {
  constructor(username, password, isauth = false) {
    this.username = username;
    this.password = password;
    this.isauth = isauth;
  }
}
app.use(express.json());


app.post("/register", async(req, res) => {
  try{
  const { username,password} = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  console.log(hashedpassword)
  const user = new User(username, hashedpassword);
  data.push(user);
  const token = jwt.sign(
    {
      user: user.username,
    },
    "Yashrajsinh-Jadeja",
    { expiresIn: "1h" }
  );
  res.status(200).json({ token });
}
catch{
 
    res.status(500).json(err) 
}
});



app.post('/login',(req,res)=>{
  try{
    const {username,password}=req.body    
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
      res.status(200).json({ token });}
      
  catch(err)
  {
    res.status(500).json(err)
  }
})

  

app.get("/getdata",jwdvalidate,(req, res) => {
    console.log(req.token)
    res.send(data);
  
});


app.get('/:id',(req,res)=>{
  res.send(req.params.id)
})

app.get('/login',(req,res)=>{
  
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//postman enviromment  prescript and post script 