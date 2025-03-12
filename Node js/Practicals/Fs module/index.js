// writing to a file 

const fs = require('fs');
const path = require('path');



// // // two types of modules synchronus and asynchronus 


// // //synchronus 

const yasg=fs.writeFileSync('input.txt', 'Hello World');
console.log(yasg,'File is written');

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
// // console.log('this will print before the file')\
// console.log(data1)
// const fd = fs.open('input.txt', 'w', (err, fd) => {
//     if (err) {
//        console.log(err);
//        return;
//     }
 
//     // Write some data to the file
//     var data = `Tutorials Point is giving self learning content
//     to teach the world in simple and easy way!!!!!
//     `;
 
//     fs.write(fd, data, (err) => {
//        if (err) {
//           console.log(err);
//           return;
//        }
 
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

// fs.unlink('input.txt', (err) => {if(err){console.log(err)}});