// writing to a file 

const fs = require('fs');
const path = require('path');



// // // two types of modules synchronus and asynchronus 


// // //synchronus 

// fs.writeFileSync('input.txt', 'Hello World');
// console.log('File is written');

// // //asynchronus

// // fs.writeFile('input.txt', 'Hello World!', (err) => {
// //     console.log('File is written');
// // }); 
// // console.log('this will print before the file')


// // //reading the file 

// // //synchronus

// const data=fs.readFileSync('input.txt','utf-8');
// console.log(data,'this is the data from the file');


// // //asynchronus

// const data1=fs.readFile('input.txt','utf-8',(err,data)=>{
//     console.log(data);
// });
// console.log('this will print before the file')\


// const fd = fs.open('input.txt', 'w', (err, fd) => {
//     if (err) {
//        console.log(err);
//        return;
//     }
 
//    //  // Write some data to the file
//    //  var data = `Bulati hai magar jane ka nahi
//    //  sari umra hum mar mar ke jee liye  ek pal to ab humein jeene do jeene do
//    //  na na na give me some sunshine give me some rain give me another chance i wanna grow up once again`;
 
//    //  fs.write(fd, data, (err) => {
//    //     if (err) {
//    //        console.log(err);
//    //        return;
//    //     }
 
//        // Close the file
//        fs.close(fd, (err) => {
//           if (err) {
//              console.log(err);
//              return;
//           }
 
//           console.log('The file was written successfully!');
//        });
//     });
//  });

// fs.unlink('input.txt', (err) => {if(err){console.log(err)}})

// const fds = fs.unlink('input.txt',(err)=>{
//     if(err){
//         console.log(err)
//     }
//     console.log('file deleted')
// })

// let yash;
// const fsd=fs.readdir('../Practicals',(err,files)=>{
//     if(err){
//         console.log(err)
//     }
//     yash=files;
//     console.log(files)
// }) 
//       console.log(yash)


const fd = fs.open('./input.txt','w+',(err,fd)=>{
    if(err){
        console.log(err)
        return;
    }
    else{
        const buffer=Buffer.alloc(1024);
  
fs.read(fd,buffer,0,buffer.length,0,(err,bytes)=>{
    if(err){
        console.log(err)
        return;
    }
    console.log(bytes)
    if(bytes>0){
        console.log(buffer.slice(0,bytes).toString())
    }
})

    }})
      







// fs.write(fd,'Hello World',(err)=>{
//     if(err){
//         console.log(err)
//         return;
//     }
//     console.log('file written')
// })