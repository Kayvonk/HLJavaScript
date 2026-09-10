// ─── The Prototype Chain ──────────────────────────────────────────────────────

// EXAMPLE 1: Manual prototype chain with Object.create()
console.log("--- Example 1: Object.create() ---");

const animal = {
  breathe() {
    console.log(`${this.name} is breathing`);
  },
  describe() {
    console.log(`I am ${this.name}, a ${this.species}`);
  }
};

const dog = Object.create(animal); // dog's [[Prototype]] is animal
dog.name    = "Rex";
dog.species = "dog";
dog.bark    = function () { console.log("Woof!"); };

dog.breathe();  // inherited from animal
dog.bark();     // own method
dog.describe(); // inherited from animal

console.log("dog.hasOwnProperty('name'):", dog.hasOwnProperty("name"));     // true
console.log("dog.hasOwnProperty('breathe'):", dog.hasOwnProperty("breathe")); // false
console.log("dog's prototype is animal:", Object.getPrototypeOf(dog) === animal); // true


// ─── EXAMPLE 2: class syntax — same prototype wiring, cleaner syntax ──────────
console.log("\n--- Example 2: class vs Object.create ---");

class Vehicle {
  constructor(make) {
    this.make = make;
  }
  describe() {
    console.log(`I am a ${this.make}`);
  }
}

class ElectricCar extends Vehicle {
  constructor(make, range) {
    super(make);
    this.range = range;
  }
  describe() {
    console.log(`I am a ${this.make} with ${this.range}mi range`);
  }
}

const tesla = new ElectricCar("Tesla", 350);
tesla.describe(); // own override

// Prototype chain verification:
console.log(
  "ElectricCar.prototype [[Prototype]] is Vehicle.prototype:",
  Object.getPrototypeOf(ElectricCar.prototype) === Vehicle.prototype // true
);
console.log(
  "tesla.hasOwnProperty('make'):", tesla.hasOwnProperty("make")          // true
);
console.log(
  "tesla.hasOwnProperty('describe'):", tesla.hasOwnProperty("describe")  // false — on prototype
);


// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Object.create() Prototype Chain
// 1. Create a 'vehicle' prototype object with a describe() method.
// 2. Use Object.create(vehicle) to create a 'car' object with a 'make' property.
// 3. Call car.describe() — it should work via inheritance.
// 4. Log car.hasOwnProperty("describe") and car.hasOwnProperty("make") to compare.

// Write your code here:



// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Class Syntax and Prototype Verification
// 1. Create a Shape class with a getArea() method that returns 0.
// 2. Extend it with a Circle class that:
//    - takes radius in the constructor
//    - overrides getArea() to return Math.PI * this.radius ** 2
// 3. Create a Circle instance and call getArea().
// 4. Log Object.getPrototypeOf(Circle.prototype) === Shape.prototype to verify the chain.

// Write your code here:
