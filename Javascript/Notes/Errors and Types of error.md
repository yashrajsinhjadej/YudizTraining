# The throw Statement

The `throw` statement allows you to create a custom error.

Technically you can **throw an exception (throw an error)**.

The exception can be a JavaScript `String`, a `Number`, a `Boolean` or an `Object`:
```js
throw "Too big";    // throw a text  
throw 500;          // throw a number
```

# Try...Catch...Finally

The `try` statement defines a code block to run (to try).

The `catch` statement defines a code block to handle any error.

The `finally` statement defines a code block to run regardless of the result.

```js
try {  
  tryCode - Code block to run  
}  
catch(err) {  
  catchCode - Code block to handle errors  
}  
finally {  
  finallyCode - Code block to be executed regardless of the try result  
}
```

## Tricky question 

```js
try{
  throw "err"
}
catch(error){
  console.log(error)
  throw "other"
}
finally{
  console.log("finally")
}
```

# Error Object

```js
let x = new Error("I am a custom error message 1");
let y = new ReferenceError("I am a custom error message 2");

console.log(x.message);//"I am a custom error message 1"
console.log(x.name);// "Error"

console.log(y.message);//"I am a custom error message 2"
console.log(y.name);// "ReferenceError"
```

# Types of Error

| **Error Name** | **Description**                              |
| -------------- | -------------------------------------------- |
| RangeError     | A number "out of range" has occurred         |
| ReferenceError | An illegal reference has occurred            |
| SyntaxError    | A syntax error has occurred                  |
| TypeError      | A type error has occurred                    |
## Range Error

A `RangeError` is thrown if you use a number that is outside the range of legal values.

```js
let num = 1;  
num.toPrecision(500);   // A number cannot have 500 significant digits  
```

## Reference Error

A `ReferenceError` is thrown if you use (reference) a variable that has not been declared.

```js
console.log(x)
let x = 10
```

## Syntax Error

A `SyntaxError` is thrown if you try to evaluate code with a syntax error.

```js
console.log('Hello)
// missing 
```

## Type Error

A `TypeError` is thrown if an operand or argument is incompatible with the type expected by an operator or function.

```js
const x = 10
x = 20 // TypeError

let num = 1
num.toUpperCase() // TypeError
```