
// let promise = job(true);

// promise
//   .then(function (data) {
//     console.log(data);

//     return job(true);
//   })
//   .then(function (data) {
//     if (data !== "victory") {
//       throw "Defeat";
//     }
//     return job(true);
//   })
//   .then(function (data) {
//     console.log(data);
//   })
//   .catch(function (error) {
//     console.log(error);

//     return job(false);
//   })
//   .then(function (data) {
//     console.log(data);

//     return job(true);
//   })
//   .catch(function (error) {
//     console.log(error);

//     return "Error caught";
//   })
//   .then(function (data) {
//     console.log(data);

//     return new Error("test");
//   })
//   .then(function (data) {
//     console.log("Success:", data.message);
//   })
//   .catch(function (data) {
//     console.log("Error:", data.message);
//   });


// const promise =new Promise (res=>res(2))
// promise.then(v=>{
//   console.log(v);
//   return v*2
// }).then(v=>{
//   console.log(v);
//   return v*2
// }).finally(v=>{
//   console.log(v);
//   return v*2
// }).then(v=>{
//   console.log(v);
// })


// let p1 =new Promise((resolve,reject)=>{
//   setTimeout(reject,300,p1)
// })

// let promise=Promise.all([p1.catch(function (){})])


// const student1={
//   a:1,
//   PrintName:function(){
//     console.log(this.a)
//   }
// }

// // x.b()

// const student2={
//   a:2,
// } 

// student1.PrintName.call(student2)

// "use strict"
// a=12

// const student1={
//   a:1,
//   PrintName:function(){
//     // console.log(this.a)
//     let a=10
//     function y(){
//       console.log(this.a)
//     }
//     return y
//       y()

//     }
// }
// student1.PrintName()

// const student2={
//   a:2,
// }

// // student2.PrintName=student1.PrintName()
// // student2.PrintName()  // undefined


// const x=student1.PrintName.call(student2)
// x.call(student2);

//call Method or Borrowing method

// const a={
//   firstName:"mohit",
//   LastName:"chawda",
// }

// FullName = function(state,city){
//   console.log(this.firstName +" "+ this.LastName+"from "+ state+" "+city)
// }

// FullName.call(a,"lksn","lknans")

// const b={
//   firstName:"rishi",
//   LastName:"patel",
// }

// FullName.apply(b,["jksja","jsbja"])

// let print=FullName.bind(b,"kjsnfa","smnna")
// print()  // rishi patel from kjsnfa smnna
// console.log(print)


// let length = 10;  // Global variable

// function fn() {
//   console.log(this.length);
// }

// var obj = {
//   length: 5,
//   method: function(fn) {
//     fn();              // Call `fn()` normally
//     arguments[0]();    // CaXll `fn()` using `arguments[0]`
//   }
// };

// obj.method(fn, 7, 8);



// function waysToDefinePropertiesInObject() {
//   const linux = {
//     distro: {
//       arch: {},
//       debian: {}
//     }
//   }
//   linux['kernel'] = [1, 2, 3, 4, 5, 6, 4.5]
//   linux.inventedBy = 'Linus Torvalds'
//   Object.defineProperty(linux, 'fs', { value: ['ext4', 'brfts'] })
//   Object.defineProperties(linux, {
//     x: { value: 10 },
//     y: { value: 100, enumerable: true, configurable: true }
//   })
//   console.log('object', Object.getOwnPropertyDescriptors(linux));
//   console.log('property descriptors', Object.getOwnPropertyDescriptors(linux));
//   // accessing key/values of object
//   console.log('properties names', Object.getOwnPropertyNames(linux));
//   console.log('object keys', Object.keys(linux));
//   console.log('Object values', Object.values(linux));
//   console.log('object entries', Object.entries(linux));
// }
// waysToDefinePropertiesInObject()

// const obj = { a: 1 };
// Object.defineProperty(obj, "b", { value: 2, enumerable: true });

// console.log(Object.keys(obj));
// console.log(obj.b);


// const obj = { a: 1, b: 2 };
// const clone = Object.assign({}, obj);
// obj.a = 99;

// console.log(clone.a);


// "use strict";
// const obj = Object.freeze({ a: 1 });
// obj.a = 2;
// console.log(obj.a);

// const Rectangle = class Rectangle2 {
//   constructor(height, width) {
//     this.height = height;
//     this.width = width;
//   }
// };
// let temp = new Rectangle(10,10)
// console.log(temp) 

// function Person() {}
// Person.prototype.name = 'Alice';
// const p1 = new Person();
// Person.prototype.n = 'Bob'
// // Person.prototype = {name : 'Bob'}
// const p2 = new Person();
// console.log(p1.name, p2.name);

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
// Copying an object
// const copiedObj = { ...obj1 };
// console.log(copiedObj); // Output: { a: 1, b: 2 }
// // Merging objects
const mergedObj = { ...obj1, ...obj2 };
console.log(mergedObj); // Output: { a: 1, b: 2, c: 3, d: 4 }