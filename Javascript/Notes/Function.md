A JavaScript `function` is a block of code designed to perform a specific task. Functions are only executed when they are `called` or `invoked`. JavaScript provides different ways to define functions, each with its own syntax and use case.

## **1. Function Declaration**

A `Function Declaration` is the traditional way to define a function. It starts with the function keyword, followed by the function name and any parameters the function needs.

```js
// Function declaration 
function add(a, b) {         
    console.log(a + b);
}

// Calling a function
add(2, 3);
```
---
## **2. Function Expression**

`Function Expression` is another way to define a function. Here, the function is defined inside a variable, and the function’s value (its returned value) is stored in that variable.

```js
// Function Expression
const add = function (a, b) {
    console.log(a + b);
}

// Calling function
add(2, 3);
```

## **3. Arrow Functions**

`Arrow Functions` were introduced in ES6 (a newer version of JavaScript). They provide a shorter syntax for writing functions. Instead of using the function keyword, you use an arrow (=>).

```js
// Single line of code
let add = (a, b) => a + b;
console.log(add(3, 2));
```

## **4. Using Function Constructor**

A function can be dynamically created using the Function constructor, but it suffers from security and performance issues and is not advisable to use.

```js
var add = Function('num1','num2','return num1+num2');
let res = add (7,8);
console.log(res); // 15
```

## **5. By using IIFE functions**

An **IIFE** (Immediately Invoked Function Expression) is an idiom in which a JavaScript function runs as soon as it is defined. It is also known as a _self-executing anonymous function_.

```js
(function () {
  // statements…
})();

// arrow function variant
(() => {
  // statements…
})();

// async IIFE
(async () => {
  // statements…
})();
```