# JavaScript 'this' Keyword

## What is 'this'?

In JavaScript, the `this` keyword refers to the object that is currently executing the code. Its value is determined by how a function is called (the execution context), not where the function is defined.

## 'this' in Different Contexts

### Global Context

In the global execution context (outside of any function), `this` refers to the global object:

- In browsers: `window` object
- In Node.js: `global` object

```javascript
console.log(this); // Window (in browser)

var globalVar = "I'm global";
console.log(this.globalVar); // "I'm global"
```

### Function Context

In a regular function, `this` depends on how the function is called:

```javascript
function showThis() {
  console.log(this);
}

// Called directly
showThis(); // Window (in browser, non-strict mode)

// In strict mode
'use strict';
function strictThis() {
  console.log(this);
}
strictThis(); // undefined
```

### Object Method Context

When a function is called as a method of an object, `this` refers to the object that owns the method:

```javascript
const user = {
  name: "John",
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

user.greet(); // "Hello, I'm John"
```

### Event Handlers

In event handlers, `this` typically refers to the element that received the event:

```javascript
document.getElementById("myButton").addEventListener("click", function() {
  console.log(this); // Refers to the button element
});
```

### Constructor Functions

When a function is used as a constructor with the `new` keyword, `this` refers to the newly created instance:

```javascript
function User(name) {
  this.name = name;
  this.sayHi = function() {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new User("John");
john.sayHi(); // "Hi, I'm John"
```

## Losing 'this' Context

A common issue is losing the `this` context when:

1. Passing a method as a callback
2. Using nested functions

```javascript
const user = {
  name: "John",
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  },
  greetLater: function() {
    setTimeout(function() {
      console.log(`Hello, I'm ${this.name}`); // this is Window, not user
    }, 1000);
  }
};

const greet = user.greet;
greet(); // "Hello, I'm undefined" (this is no longer user)
user.greetLater(); // "Hello, I'm undefined" (this is Window in the callback)
```

## Fixing 'this' Context

### Method 1: Using Arrow Functions

Arrow functions do not have their own `this` binding. They inherit `this` from the surrounding scope:

```javascript
const user = {
  name: "John",
  greetLater: function() {
    setTimeout(() => {
      console.log(`Hello, I'm ${this.name}`); // this is user
    }, 1000);
  }
};

user.greetLater(); // "Hello, I'm John"
```

### Method 2: Using bind()

The `bind()` method creates a new function with a fixed `this` value:

```javascript
const user = {
  name: "John",
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  },
  greetLater: function() {
    setTimeout(this.greet.bind(this), 1000);
  }
};

const greet = user.greet.bind(user);
greet(); // "Hello, I'm John"
user.greetLater(); // "Hello, I'm John"
```

### Method 3: Using call() and apply()

`call()` and `apply()` methods call a function with a specified `this` value:

```javascript
function greet(greeting) {
  console.log(`${greeting}, I'm ${this.name}`);
}

const john = { name: "John" };
const jane = { name: "Jane" };

// With call (arguments passed individually)
greet.call(john, "Hello"); // "Hello, I'm John"

// With apply (arguments passed as an array)
greet.apply(jane, ["Hi"]); // "Hi, I'm Jane"
```

### Method 4: Self/That Pattern (Pre-ES6)

Storing `this` in a variable to use in nested functions:

```javascript
const user = {
  name: "John",
  greetLater: function() {
    const self = this; // Store this
    setTimeout(function() {
      console.log(`Hello, I'm ${self.name}`);
    }, 1000);
  }
};

user.greetLater(); // "Hello, I'm John"
```

## 'this' in Classes

In ES6 classes, `this` refers to the instance of the class:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
  
  // Note: Methods defined in the class are not bound by default
  // Use arrow functions for class fields to auto-bind
  greetLater = () => {
    setTimeout(() => {
      console.log(`Hello, I'm ${this.name}`);
    }, 1000);
  }
}

const user = new User("John");
user.greet(); // "Hello, I'm John"
user.greetLater(); // "Hello, I'm John"
```