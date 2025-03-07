    # JavaScript 'super' Keyword

## What is 'super'?

The `super` keyword is used to call functions on an object's parent. It's primarily used in classes to:

1. Call the parent class constructor
2. Call parent class methods
3. Access parent class properties

## Calling the Parent Constructor

When extending a class, you must call `super()` in the derived class constructor before using `this`:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
    this.species = "Animal";
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // Must call super before using 'this'
    super(name);
    this.breed = breed;
    this.species = "Canis familiaris";
  }
}

const rex = new Dog("Rex", "German Shepherd");
console.log(rex.name); // "Rex"
console.log(rex.breed); // "German Shepherd"
console.log(rex.species); // "Canis familiaris"
```

Important rules:

- If you define a constructor in a derived class, you **must** call `super()` before using `this`
- If you don't define a constructor, one is created automatically that calls `super(...args)`
- You must call `super()` before returning from the constructor

## Calling Parent Methods

Use `super.methodName()` to call a method from the parent class:

```javascript
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.speed = 0;
  }
  
  accelerate(amount) {
    this.speed += amount;
    console.log(`Vehicle accelerating to ${this.speed} mph`);
  }
  
  brake(amount) {
    this.speed = Math.max(0, this.speed - amount);
    console.log(`Vehicle slowing to ${this.speed} mph`);
  }
  
  describe() {
    return `${this.make} ${this.model}`;
  }
}

class SportsCar extends Vehicle {
  constructor(make, model, topSpeed) {
    super(make, model);
    this.topSpeed = topSpeed;
  }
  
  accelerate(amount) {
    // Call parent method first
    super.accelerate(amount * 1.5); // Sports cars accelerate faster
    
    if (this.speed > this.topSpeed) {
      this.speed = this.topSpeed;
      console.log(`Reached top speed of ${this.topSpeed} mph`);
    }
  }
  
  describe() {
    // Extend parent's method
    return `${super.describe()} (Top Speed: ${this.topSpeed} mph)`;
  }
}

const ferrari = new SportsCar("Ferrari", "F430", 196);
ferrari.accelerate(50); // "Vehicle accelerating to 75 mph"
console.log(ferrari.describe()); // "Ferrari F430 (Top Speed: 196 mph)"
```

## Accessing Parent Class Properties

You can use `super` to access parent class properties:

```javascript
class Base {
  constructor() {
    this.baseProp = "I'm from the base class";
  }
  
  get baseValue() {
    return "Base value";
  }
}

class Derived extends Base {
  constructor() {
    super();
    console.log(super.baseValue); // Accessing parent's getter
    this.derivedProp = `Extended with: ${super.baseProp}`;
  }
}

const derived = new Derived();
console.log(derived.derivedProp); // "Extended with: I'm from the base class"
```

## 'super' in Object Literals

The `super` keyword can also be used in object literals with a prototype:

```javascript
const parent = {
  greet() {
    return "Hello from parent";
  },
  
  name: "Parent Object"
};

const child = {
  __proto__: parent,
  
  greet() {
    return `${super.greet()} and child`;
  },
  
  introduce() {
    return `I'm a child of ${super.name}`;
  }
};

console.log(child.greet()); // "Hello from parent and child"
console.log(child.introduce()); // "I'm a child of Parent Object"
```

## Static Methods and super

`super` also works with static methods in the same way:

```javascript
class BaseUtility {
  static getClassName() {
    return "BaseUtility";
  }
  
  static createInstance() {
    return new this();
  }
}

class DerivedUtility extends BaseUtility {
  static getClassName() {
    return `${super.getClassName()}.DerivedUtility`;
  }
  
  static createInstance() {
    console.log(`Creating an instance of ${this.getClassName()}`);
    return super.createInstance();
  }
}

console.log(DerivedUtility.getClassName()); // "BaseUtility.DerivedUtility"
const instance = DerivedUtility.createInstance();
// Logs: "Creating an instance of BaseUtility.DerivedUtility"
```

## Common Mistakes with super

### Forgetting to Call super() in Constructor

```javascript
class Base {
  constructor() {
    this.prop = "base";
  }
}

class Wrong extends Base {
  constructor() {
    // Missing super() call
    this.newProp = "derived"; // ReferenceError: Must call super first
  }
}
```

### Using super Outside of Class or Object Methods

```javascript
class MyClass extends BaseClass {
  constructor() {
    super();
    
    const arrowFunc = () => {
      // This is fine - arrow functions inherit 'this' and 'super'
      super.parentMethod();
    };
    
    function regularFunc() {
      // Error: 'super' keyword unexpected here
      super.parentMethod();
    }
  }
}
```

### Calling Methods with Wrong Context

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

class Child extends Parent {
  constructor(name) {
    super(name);
  }
  
  greet() {
    // Correct usage
    return `${super.greet()} Jr.`;
    
    // Wrong usage would be:
    // const parentGreet = super.greet; // super reference is bound to method
    // return `${parentGreet()} Jr.`; // 'this' context lost
  }
}
```

## super with Multiple Levels of Inheritance

```javascript
class Animal {
  speak() {
    return "Animal speaks";
  }
}

class Mammal extends Animal {
  speak() {
    return `${super.speak()} in Mammal way`;
  }
}

class Dog extends Mammal {
  speak() {
    return `${super.speak()} and barks`;
  }
}

const dog = new Dog();
console.log(dog.speak()); // "Animal speaks in Mammal way and barks"
```
