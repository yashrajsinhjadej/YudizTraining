# JavaScript Prototypes

## What is Prototype-Based Inheritance?

JavaScript is a prototype-based language, where objects inherit properties and methods from other objects (their prototypes) rather than from classes. This prototype chain forms the basis of inheritance in JavaScript.

## Object Prototypes

Every JavaScript object has a hidden property called `[[Prototype]]` (exposed as `__proto__`), which points to its prototype object. When a property is accessed on an object, JavaScript first looks for the property on the object itself. If not found, it looks up the prototype chain.

```javascript
const animal = {
  eats: true,
  sleep() {
    console.log("Zzz...");
  }
};

const rabbit = {
  jumps: true,
  __proto__: animal // Set animal as the prototype of rabbit
};

console.log(rabbit.eats); // true (inherited from animal)
rabbit.sleep(); // "Zzz..." (method inherited from animal)
```

## The Prototype Chain

 Objectsform a chain of prototypes that JavaScript traverses when looking for properties:

```javascript
const grandparent = {
  grandproperty: "I'm from grandparent"
};

const parent = {
  property: "I'm from parent",
  __proto__: grandparent
};

const child = {
  childProperty: "I'm from child",
  __proto__: parent
};

console.log(child.childProperty); // "I'm from child"
console.log(child.property); // "I'm from parent"
console.log(child.grandproperty); // "I'm from grandparent"
```

All chains eventually end with `Object.prototype`, whose prototype is `null`:

```javascript
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

## Constructor Functions and Prototypes

Constructor functions provide a way to create multiple objects with the same structure:

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Methods are added to the prototype to be shared by all instances
Person.prototype.greet = function() {
  console.log(`Hello, my name is ${this.name}`);
};

Person.prototype.getAge = function() {
  return this.age;
};

const john = new Person("John", 30);
const jane = new Person("Jane", 25);

john.greet(); // "Hello, my name is John"
jane.greet(); // "Hello, my name is Jane"

console.log(john.getAge()); // 30
console.log(jane.getAge()); // 25
```

When you use the `new` keyword with a constructor function:

1. A new empty object is created
2. The function is called with `this` set to the new object
3. The new object's `[[Prototype]]` is set to the constructor's `prototype` property
4. The object is returned (unless the function returns its own object)

## Native Prototypes

Built-in JavaScript objects like Array, String, etc. also use prototypes:

```javascript
const arr = [1, 2, 3];
console.log(arr.__proto__ === Array.prototype); // true
console.log(arr.__proto__.__proto__ === Object.prototype); // true

// Adding methods to native prototypes (not generally recommended)
Array.prototype.first = function() {
  return this[0];
};

console.log([10, 20, 30].first()); // 10
```

## Prototype Methods vs. Instance Methods

```javascript
function User(name) {
  this.name = name;
  
  // Instance method - a copy exists on each instance
  this.sayHi = function() {
    console.log(`Hi, I'm ${this.name}`);
  };
}

// Prototype method - shared by all instances
User.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const user1 = new User("Alice");
const user2 = new User("Bob");

console.log(user1.sayHi === user2.sayHi); // false (different function objects)
console.log(user1.greet === user2.greet); // true (same function object)
```

## Prototypal Inheritance

Creating inheritance hierarchies with constructors and prototypes:

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating.`);
};

function Dog(name, breed) {
  // Call parent constructor
  Animal.call(this, name);
  this.breed = breed;
}

// Create inheritance relationship
Dog.prototype = Object.create(Animal.prototype);
// Fix the constructor property
Dog.prototype.constructor = Dog;

// Add Dog-specific methods
Dog.prototype.bark = function() {
  console.log(`${this.name} says woof!`);
};

// Override parent method
Dog.prototype.eat = function() {
  console.log(`${this.name} is eating like a dog.`);
};

const rex = new Dog("Rex", "German Shepherd");
rex.eat(); // "Rex is eating like a dog."
rex.bark(); // "Rex says woof!"
```

## Prototype vs. Class Syntax

ES6 classes are syntactic sugar over prototypes:

```javascript
// Class syntax
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} says woof!`);
  }
  
  eat() {
    console.log(`${this.name} is eating like a dog.`);
  }
}

// Equivalent prototype syntax
function AnimalProto(name) {
  this.name = name;
}

AnimalProto.prototype.eat = function() {
  console.log(`${this.name} is eating.`);
};

function DogProto(name, breed) {
  AnimalProto.call(this, name);
  this.breed = breed;
}

DogProto.prototype = Object.create(AnimalProto.prototype);
DogProto.prototype.constructor = DogProto;

DogProto.prototype.bark = function() {
  console.log(`${this.name} says woof!`);
};

DogProto.prototype.eat = function() {
  console.log(`${this.name} is eating like a dog.`);
};
```

## Property Shadowing

When a property exists on both an object and its prototype, the object's property takes precedence:

```javascript
const proto = {
  shared: "I'm shared",
  describe() {
    return "I'm the prototype";
  }
};

const obj = Object.create(proto);
obj.own = "I'm own property";

console.log(obj.shared); // "I'm shared" (from prototype)

// Shadow the prototype property
obj.shared = "I'm not shared anymore";
console.log(obj.shared); // "I'm not shared anymore" (from obj)
console.log(proto.shared); // "I'm shared" (original value unchanged)

// Check if property exists directly on the object
console.log(obj.hasOwnProperty("own")); // true
console.log(obj.hasOwnProperty("shared")); // true (now it's an own property)
console.log(obj.hasOwnProperty("describe")); // false (from prototype)
```

## Best Practices

1. **Use classes for new code** - The class syntax is cleaner and less error-prone
2. **Avoid modifying built-in prototypes** - It can lead to conflicts with libraries or future JavaScript features
3. **Use Object.create(null)** for pure dictionaries - No inherited properties from Object.prototype
4. **Use composition over inheritance** when appropriate
5. **Understand the difference** between prototype and instance properties