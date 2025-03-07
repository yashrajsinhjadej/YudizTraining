# Execution Context
JavaScript Execution Context is the environment in which JavaScript code is executed. It contains information about the variables, functions, and objects that are available to the code being executed, as well as the scope chain and the value of the `this` keyword.

There are two phases of JavaScript execution context:

1. **Creation phase**: In this phase, the JavaScript engine creates the execution context and sets up the script's environment. It determines the values of variables and functions and sets up the scope chain for the execution context.
2. **Execution phase**: In this phase, the JavaScript engine executes the code in the execution context. It processes any statements or expressions in the script and evaluates any function calls.

## Types of Execution context
- Global Execution Context (GEC)
- Function Execution Context (FEC)

### Global Execution Context
- Whenever the JavaScript engine receives a script file, it first creates a default Execution Context known as the **`Global Execution Context (GEC)`**.
### Function Execution Context
- Whenever a function is called, the JavaScript engine creates a different type of Execution Context known as a Function Execution Context (FEC) within the GEC to evaluate and execute the code within that function.
- Since every function call gets its own FEC, there can be more than one FEC in the run-time of a script.

## Closure
A closure occurs when a function retains access to variables from its outer (lexical) environment even after that environment has completed execution. In your example:

```js
function x(){
  let x = 10
  return function(){
    console.log(x)
  }
}
```


# Scope
Scope determines the accessibility of variables, objects, and functions from different parts of the code.

## Types of Scope

### 1. Global Scope

- Variables declared **Globally** (outside any function and block) have **Global Scope**.
- **Global** variables can be accessed from anywhere in a JavaScript program.

```js
var x = 10
let y = 20
const z = 30

// All are global scope
```

### 2. Function Scope

- JavaScript has function scope: Each function creates a new scope.
- Variables defined inside a function are not accessible (visible) from outside the function.
- Variables declared with `var`, `let` and `const` are quite similar when declared inside a function.

```js
function add(){
	var x = 10
	let y = 20
	const z = 30
}

console.log(x,y,z) // ReferenceError
```

### 3. Block Scope

- Variables declared inside a { } block have block scope .

```js
{
	let x = 10
	const y = 20
	var z = 30
}
console.log(x) // Error
console.log(y) // Error
console.log(z) // 30 , var is function scope so it can be accessed outside of a block 

```

## Scope Chain

- JavaScript engine uses scopes to find out the exact location or accessibility of variables and that particular process is known as Scope Chain.
- This complete chain goes to find that variables until it is found or till global

```js
function abc(){
	let x = 10
	let z
	{
		let y = 20
		{
			let y = 30
			console.log(x , y) // 10,30
			z = 50 // This will go up in the scope and if no reference found , this will declare z in global scope
		}
	}
}
```


# Hoisting

- Hoisting is JavaScript's default behavior of moving declarations to the top of the scope.

-  `function declaration` will be hoisted to the top with its value .

```js
print() // "Hello World"

function print(){
	console.log("Hello World")
}
```

- `var` variables will be hoisted to the top but value will be `undefined` .

```js
console.log(x) // undefined
var x = 10
```

- `let` and `const` variables will be hoisted to the top but it cannot be accessed before the declaration .

```js
console.log(x) // error
let x = 10
```

