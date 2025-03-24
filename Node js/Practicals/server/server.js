const http = require('http') // 
const user=[{'id':1,'name':'yash'}]
const server = http.createServer((req,res)=>{
 if(req.method=='GET' && req.url.startsWith('/api/users'))
    {
        console.log('get metod called')
        let id = req.url.split('/')[3]
        // console.log(id)
        flag=false
        for(let i in user){
            if(user[i].id==id){
                res.writeHead(200,{'content-Type':'application/json'})
                res.end(JSON.stringify(user[i]))
                flag=true
            }       
        }
        if(!flag){
            res.end('not found')
        }
    }
 else if(req.method==='POST' && req.url==='/api/users/new')
    {
        console.log('post method called')
        let body=''
        req.on('data',(chunk)=>{
            body+=chunk
        })
        req.on('end',()=>{
            try{
            let userdata=body.parse()
            userdata.push(user)}
            catch{
                console.log('error')
            }
        })
    }
 else if(req.method=='PUT')
    {let body=''
        res.writeHead(200,{'content-Type':'application/json'})
        
        let id= req.url.split('/')[4]
        console.log(id)
        req.on('data',(chunk)=>{
            body+=chunk
        })
        req.on('end',()=>{
            if(body){
            res.writeHead(200,{'content-Type':'application/json'})
            let userdata=body.parse()
            console.log('user updated')
            res.end('user updated')
            }
            else{
                res.writeHead(404,{'content-Type':'application/json'})
                console.log('user updated')
            }
        })}
 else if(req.method=="DELETE" && req.url.startsWith('/api/delete/user')){
    let id = req.url.split('/')[4]
    console.log(id)
    flag=false
    for(let i in user){
        if(user[i].id==id){
            res.writeHead(200,{'content-Type':'JSON'})
            flag=true
            res.end(JSON.stringify(user[i]))
        }       
    }
    if(!flag){
        res.writeHead(404,{'content-Type':'application/json'})
        res.end(JSON.stringify({error:'id not found'}))
    }      
 }
 else{
    console.log(req.url)
    res.writeHead(404,{'content-Type':'application/json'})
    res.end(JSON.stringify({error:'invalid route'}))
 }
})
server.listen(3000,(err)=>{
    
    if(err){
        console.log(err)
    }
    else{
        console.log('server started')
    }
})  