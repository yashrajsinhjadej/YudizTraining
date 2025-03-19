let EventEmitter=require('events');

const eventEmitter = new EventEmitter()


// // eventEmitter.on('hello',()=>{
// //     setTimeout(()=>{console.log('hello')},1000)
// // })

// eventEmitter.on('hello',function(err){
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('hello')
//     }
// })


// eventEmitter.emit('hello',new Error('whoops'))
// // eventEmitter.emit('hello')
// console.log('hello1')

// let p = new EventEmitter({captureRejections:true});
// let e = new EventEmitter({captureRejections: true});

// p.on('something',async (value)=>{
//     throw new Error('whoops');
// })
// .on('error',(err)=>{
//     console.log('caught');
// })  

// p.emit('something');





// e.on('something', async (value)=>{
//     throw new Error('#Some error');
// })
// .on('error', ()=>{
//     console.log("Error listner...");
// });

// e.emit('something');

// p[Symbol.for('nodejs.rejection')] = function() {
// 	console.log("Another function...");
// }




eventEmitter.on("newListener", (name, reference) => {
        console.log("Added a listener");
        console.log(name);
        console.log(reference.toString());
    
    });
    
    eventEmitter.on("event1", (para) => {
        console.log(para);
    });