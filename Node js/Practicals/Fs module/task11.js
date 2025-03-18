// const fs = require('fs');

// // Create a Writable stream to a file
// const writeStream = fs.createWriteStream('the_princess_bride_output.txt');

// // Writable stream 'finish' event handler
// writeStream.on('finish', () => {
//   console.log('Data writing complete.');
// });

// // Writable stream 'error' event handler
// writeStream.on('error', (err) => {
//   console.error(`Error occurred: ${err}`);
// });

// // Write a quote from "The  to the Writable stream
// writeStream.write('As ');
// writeStream.write('You ');
// writeStream.write('Wish');
// writeStream.end();

const fs = require('fs')
writestream = fs.createWriteStream('yash.txt')
writestream.on('finish',()=>{
  console.log('done')
})
writestream.on("error",(err)=>{
  console.log(err)
})
writestream.write('hello ')
writestream.write('world')
writestream.end()