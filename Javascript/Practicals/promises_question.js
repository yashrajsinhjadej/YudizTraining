// "use strict"

// console.log("Start");

// const promise1 = new Promise((resolve, reject) => {
//   console.log("Promise constructor");
//   resolve("Promise resolved");
// });

// promise1.then(res => console.log(res));

// console.log("End");


// let promise = new Promise((resolve, reject) => {
//   resolve("Resolved!");
// });

// promise.then(res => {
//   console.log(res);
//   return "Another value";
// });

// promise.then(res => console.log(res));

// console.log("A");

// setTimeout(() => console.log("B"), 0);

// Promise.resolve().then(() => console.log("C"));

// console.log("D");


// Promise.resolve("First")
//   .then((res) => {
//     console.log(res);
//     return "Second";
//   })
//   .then((res) => {
//     console.log(res);
//     throw new Error("Something went wrong");
//   })
//   .then((res) => console.log(res))
//   .catch((err) => console.log("Caught:", err.message))
//   .then(() => console.log("After catch"));

// const p1 = Promise.resolve("One");
// const p2 = new Promise((resolve, reject) => setTimeout(() => reject("Error"), 1000));
// const p3 = Promise.resolve("Three");

// Promise.all([p1, p2, p3])
//   .then(values => console.log(values))
//   .catch(error => console.log("Caught:", error));


// async function test() {
//   try {
//     return await Promise.reject("Oops!");
//   } catch (error) {
//     return "Caught!";
//   }
// }

// test().then(res => console.log(res));


// function retry(fn, retries = 3) {
//   return fn().catch(err => {
//     if (retries >= 0) {
//       console.log(`Retrying... (${retries} left)`);
//       return retry(fn, retries - 1);
//     } else {
//       throw "mohit";
//     }
//   });
// }

// // Example usage:
// retry(() => Promise.reject("Failed!"), 3)
//   .then(() => console.log("Success!"))
//   .catch(err => console.log("Final Failure:", err));



// console.log("Start");

// setTimeout(() => {
//   console.log("Timeout 1");
//   Promise.resolve().then(() => console.log("Promise inside Timeout 1"));
// }, 0);

// Promise.resolve().then(() => {
//   console.log("Promise 1");
//   setTimeout(() => console.log("Timeout inside Promise 1"), 0);
// });

// console.log("End");

// const promise = new Promise((resolve, reject) => {
//   resolve("First Resolve");
//   reject("Reject Attempted");
//   resolve("Second Resolve");
// });

// promise.then(res => console.log(res)).catch(err => console.log(err));

// const thanble = {
//   then:  function (callback){
//       setTimeout(()=>callback(2),1000)
//   }
// }
// const value = await thanble
// console.log(value)

// const p1 = new Promise((resolve) => setTimeout(() => resolve("P1 resolved"), 3000));
// const p2 = new Promise((resolve) => setTimeout(() => resolve("P2 resolved"), 1000));

// Promise.race([p1, p2]).then(res => console.log(res));


// async function fetchData() {
//   console.log("Fetching data...");
//   const data = await new Promise(resolve => setTimeout(() => resolve("Data received"), 2000));
//   console.log(data);
//   return "Processing done";
// }

// fetchData().then(res => console.log(res));
// console.log("Outside async function");


// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function demo() {
//   console.log("Before sleep");
//   await sleep(2000);
//   console.log("After sleep");
// }

// demo();

// const tasks = [
//   () => new Promise(resolve => setTimeout(() => resolve("Task 1"), 1000)),
//   () => new Promise(resolve => setTimeout(() => resolve("Task 2"), 500)),
//   () => new Promise(resolve => setTimeout(() => resolve("Task 3"), 2000))
// ];

// async function runInSequence(tasks) {
//   for (const task of tasks) {
//     console.log(await task());
//   }
// }

// runInSequence(tasks);


// const p1 = Promise.resolve("Success 1");
// const p2 = Promise.reject("Error 1");
// const p3 = Promise.reject("Error 2");

// Promise.all([p1, p2, p3])
//   .then(values => console.log(values))
//   .catch(err => console.log("Caught:", err));

// const p1 = Promise.resolve("Success");
// const p2 = Promise.reject("Failure");

// Promise.allSettled([p1, p2]).then(results => console.log(results));


// function sleep(ms){
//   return new Promise(res=>{
//     setTimeout(res,ms)
//   })
// }

// sleep(2)

// function job(){
//   return new Promise((resolve,reject)=>{
//     reject()
//   })
// }

// let promise=job()

// promise.then(()=>{
//   console.log("resolved1")
// }).then(()=>{
//   console.log("suu2")
// }).then(()=>{
//   console.log("s3");
// }).catch(()=>{
//   console.log("error")
// }).then(()=>{
//   console.log("s4")
// })

// function job(state){
//     return new Promise((resolve,reject)=>{
//       if(state){
//         resolve("resolve")
//       }else{
//         reject("error")
//       }
//     })
//   }
  
//   let promise=job(true)
  
//   promise.then((data)=>{
//     console.log(data)
//     return job(false)
//   }).then((data)=>{
//     if(data!=="victory"){
//       throw "Defeat"
//     }
//     return job(true)
//   }).then((data)=>{
//     console.log(data);
//   })
//   .catch((error)=>{
//     console.log(error)
//     return job(false)
//   }).then((data)=>{
//     console.log("data");
//     return job(true)
//   }).catch((error)=>{
//     console.log(error)
//     return "error caught"
//   }).then((data)=>{
//     console.log(data);
//     return new Error ("test")
//   }).then((data)=>{
//     console.log("success",data.message);
//   }).catch((data)=>{
//     console.log("error",data.message);
//   })
  


// function job(state) {
//   return new Promise(function (resolve, reject) {
//     if (state) {
//       resolve("success");
//     } else {
//       reject("error");
//     }
//   });
// }

// const mul={
//   a:2,
//    x(arr){
//   // console.log(this)
//   return arr.map((num)=>{
//     return num *this.a
//   },this)
// }
// }
// console.log(mul.x([1,2,3]))

// function test() {
//   "use strict"
//   console.log(this);
// }
// const obj = { test: test.bind(null) };
// obj.test();

// const obj1={a:1,b:2}
// const obj2={c:3,d:4}

// const obj3=Object.assign(obj1,obj2)
// console.log(obj3)

// const obj1 = { a: 0, b: { c: 0 } };
// const obj2 = Object.assign({}, obj1);
// console.log(obj2);

// obj2.b.c=6
// console.log(obj1)
// console.log(obj2);


// let obj1 = { name: "Alice", address: { city: "New York" } };

// let obj2 = JSON.parse(JSON.stringify(obj1)); // Deep Copy

// obj2.address.city = "Los Angeles"; // Only changes obj2

// console.log(obj1.address.city); // Output: New York ✅ (No unintended changes)

// console.log(obj2)
// console.log(obj1);
;

// "use strict"

// function test(){
//   "use strict"
//   console.log(this) 
// }

// // console.log([1,2,3].forEach(test))
// [1,2,3].forEach(test,{value:2})


// console.log(globalThis);
// "use strict"

// // const globalThis=this
// function test(){
//   this
// }
// console.log(this===globalThis);
// console.log(test());
// // test()

// // "use strict"
// const obj={
//   method(){
//     console.log(this.value=10);
//     //  this
//   }
// }

// // console.log(obj.method());
// obj.method()


// function fun1(fn)
// {
//   fn=()=>{
//     return ("78");
    
//   }
// }

// function fun2(){
//   console.log("71");
// }

// temp=fun1(fun2)
// temp()
// fun2() // 78

// const obj={
//   a:2
// }

// const obj1=(Object.assign(obj));
// console.log(obj1);

 
// class C {
//   constructor() {
//     this.a = 37;
//   }
// }

// // console.log(new C);
// // let o=new C()
// // console.log(o.a);



// let o = new C();
// console.log(o.a); // 37

// class C2 {
//   constructor() {
//     this.a = 37;
//     return { a: 38 };
//   }
// }

// o = new C2();
// console.log(o.a); // 38


// this.a=4
// console.log(this.a)
// // console.log(this.a) // 4


// function test(c,d){
//   return this.a + this.b + c+d
// }
// const o={a:1,b:2}
// console.log(test.call(o,2,3))

// const averageSharePriceByMonthQ1 = [109.6, 103.3, 89.4]
// const averageSharePriceByMonthQ2 = [109.3, 126.1, 103.3]
// const averageSharePriceByMonthQ3 = [120.8, 102.3, 106.8]
// const averageSharePriceByMonthQ4 = [110.9, 119.8, 113.7]

// function findPriceExtremes(arr){
//     const highest = Math.max(...arr)
//     const lowest = Math.min(...arr)
//     console.log(`The highest average share price was ${highest}`)
//     console.log(`The lowest average share price was ${lowest}`)
// }
// findPriceExtremes([...averageSharePriceByMonthQ1,...averageSharePriceByMonthQ2,...averageSharePriceByMonthQ3,...averageSharePriceByMonthQ4])

// // console.log([...averageSharePriceByMonthQ1,...averageSharePriceByMonthQ2,...averageSharePriceByMonthQ3,...averageSharePriceByMonthQ4]);


// const a={
//   c:2,
//   mehod:[1,2,3]
// }

// const b =structuredClone(a)
// b.mehod[0]=4
// console.log(b.mehod);


// const a={
//   c:2,
//   method:[1,2,3]
// }

// const b = Object.assign(a)
// console.log(b);

// a.method[0]=7
// console.log(a);
// console.log(b);

// const product={
//   value:2,
//   sales:5,
//   productInfo:function(){
//     console.log(this)
//   }
// }

// const productsales=product.productInfo.bind(product)
// productsales()

// product.productInfo()


// propertyDescriptor
// function intro() {
//     const o1 = {
//         fName: 'vishal',
//         lName: 'prajapati',
//         age: 22,
//         get getAge() {
//             return this.age
//         },
//         set getAge(age) {
//             this.age = 22
//         }
//     }
//     o1.dept = 'web'
// const desc_for_one_field = Object.getOwnPropertyDescriptor(o1, 'fName')
// console.log('desc for one field', desc_for_one_field);
// const desc_for_all_fields = Object.getOwnPropertyDescriptors(o1)
// console.log('desc for all fields', desc_for_all_fields);
// /*
//     ####################### property descriptors ######################
//     definition:object associated with each property of the object that contains
//      information about their properties.
//     property descriptor object keys(6):[configurable,writable,enumerable,value,get,set]

//     types of property descriptor:
//     1. Data descriptor :[configurable,writable,value,enumerable]
//     2. Accessor descriptor:[configurable,enumerable,set,get]


//     configurable: changing the property is allowed or property can be deleted (true/false)
//     enumerable: can be see during the enumeration example for ...... in loop (true/false)
//     writable: changing value allowed or not (true/fa)
//     */
// }
// intro()

