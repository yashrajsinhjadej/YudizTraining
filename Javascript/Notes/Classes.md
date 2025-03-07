# JavaScript Classes

## Introduction to Classes

Classes were introduced in ES6 (ECMAScript 2015) to provide a cleaner, more intuitive syntax for creating objects and implementing inheritance. Under the hood, JavaScript classes are primarily syntactic sugar over the existing prototype-based inheritance.

## Class Declaration Syntax

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
  
  getAge() {
    return this.age;
  }
}

// Creating an instance
const john = new Person("John", 30);
john.sayHello(); // "Hello, my name is John"
console.log(john.getAge()); // 30
```

## Class Expression Syntax

Classes can also be defined using class expressions:

```javascript
// Unnamed class expression
const Person = class {
  constructor(name) {
    this.name = name;
  }
};

// Named class expression
const Employee = class EmployeeClass {
  constructor(name) {
    this.name = name;
  }
  
  // The name EmployeeClass is only visible inside the class
  getName() {
    return EmployeeClass.formatName(this.name);
  }
  
  static formatName(name) {
    return name.toUpperCase();
  }
};
```

## Constructor Method

The `constructor` method is a special method for creating and initializing objects:

```javascript
class User {
  constructor(username, email) {
    // Initialize properties
    this.username = username;
    this.email = email;
    this.createdAt = new Date();
  }
}
```

Notes about constructors:

- A class can only have one constructor
- If you don't provide a constructor, a default empty one is created
- The constructor must be called with `new` keyword

## Class Fields

Class fields allow you to add properties directly to the class definition:

```javascript
class User {
  // Public fields (available since ES2022)
  username;
  email;
  createdAt = new Date(); // With default value
  
  // Private fields (prefix with #)
  #token = Math.random().toString(36);
  
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
  
  getToken() {
    return this.#token;
  }
}

const user = new User("john", "john@example.com");
console.log(user.createdAt); // Current date/time
console.log(user.getToken()); // Random token
// console.log(user.#token); // Error: Private field
```

## Methods

### Instance Methods

Methods defined in the class body become part of the prototype:

```javascript
class Calculator {
  add(a, b) {
    return a + b;
  }
  
  subtract(a, b) {
    return a - b;
  }
  
  multiply(a, b) {
    return a * b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
```

### Static Methods

Static methods are called on the class itself, not on instances:

```javascript
class MathUtils {
  static PI = 3.14159;
  
  static square(x) {
    return x * x;
  }
  
  static distance(x1, y1, x2, y2) {
    return Math.sqrt(this.square(x2 - x1) + this.square(y2 - y1));
  }
}

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.square(4)); // 16
console.log(MathUtils.distance(0, 0, 3, 4)); // 5
```

### Getter and Setter Methods

Getters and setters allow you to control access to properties:

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }
  
  get celsius() {
    return this._celsius;
  }
  
  set celsius(value) {
    if (value < -273.15) {
      throw new Error("Temperature below absolute zero is not possible");
    }
    this._celsius = value;
  }
  
  get fahrenheit() {
    return this._celsius * 9/5 + 32;
  }
  
  set fahrenheit(value) {
    this.celsius = (value - 32) * 5/9;
  }
}

const temp = new Temperature(25);
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77

temp.fahrenheit = 68;
console.log(temp.celsius); // 20
```

## Class Inheritance

Classes can extend other classes to inherit their properties and methods:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} barks.`);
  }
  
  fetch() {
    console.log(`${this.name} fetches the ball.`);
  }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak(); // "Rex barks."
dog.fetch(); // "Rex fetches the ball."
```

Key inheritance concepts:

- `extends` keyword establishes inheritance
- `super()` calls the parent class constructor
- Child classes can override parent methods
- Child classes can add new methods
