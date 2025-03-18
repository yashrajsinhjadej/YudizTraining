function yash(){
    return new Promise((res,rej)=>{
        setTimeout(rej,2000,123)
    }) 
}
yash()
    .then((data)=> 
        {console.log(data)
            return data})
    .then((data)=>{console.log(data); return data})
    .then((data)=>setInterval(()=>{
        data+=1
        console.log(data)
    },1000))
    .catch((data)=>{console.log(data)})