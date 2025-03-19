
const { EventEmitter, captureRejectionSymbol } = require("node:events");

const eventEmitter = new EventEmitter();

eventEmitter.emit("error")

eventEmitter.on('error',(err)=>{   // ask sir about this 
    if(err){
        console.log(err)
    }
    console.log('error')
})

