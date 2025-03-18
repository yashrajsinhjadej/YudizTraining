Much of the Node.js core API is built around an idiomatic asynchronous event-driven architecture in which certain kinds of objects (called 
"emitters") emit named events that cause `Function` objects ("listeners") to be called.

Event emitters offer several advantages:
1. Make it easier for developers to work with events
2. Simplify adding future events
3. Remove the need for abstract functions

All objects that emit events are instances of the `EventEmitter` class. These objects expose an `eventEmitter.on()` function that allows one or more functions to be attached to named events emitted by the object.
- When the `EventEmitter` object emits an event, all of the functions attached to that specific event are called _synchronously_. 
- Any values returned by the called listeners are _ignored_ and discarded.


## Basic Example : 

```js
const { EventEmitter } = require("node:events");

const eventEmitter = new EventEmitter();

eventEmitter.on("event1", () => {
    console.log("func1");
});
console.log(eventEmitter.emit("event1"));
```

---

# Error events

When an error occurs within an `EventEmitter` instance, the typical action is for an `'error'` event to be emitted. These are treated as special cases within Node.js.

If an `EventEmitter` does _not_ have at least one listener registered for the `'error'` event, and an `'error'` event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits.

As a best practice, listeners should always be added for the `'error'` events.

```js
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});

myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
```


---

> [!Handle Promise Rejections]
> The `captureRejections` option in the `EventEmitter` constructor or the global setting change this behavior, installing a  `.then(undefined, handler)`  handler on the `Promise`. This handler routes the exception asynchronously to the `Symbol.for('nodejs.rejection')`method if there is one, or to `error` event handler if there is none.

```js
let e = new EventEmitter({captureRejections: true});

e.on('something', async (value)=>{
    throw new Error('#Some error');
})
.on('error', ()=>{
    console.log("Error listner...");
});

e.emit('something');

e[Symbol.for('nodejs.rejection')] = function() {
	console.log("Another function...");
}
```

Setting `events.captureRejections = true` will change the default for all new instances of `EventEmitter`.

---

# Event : newListener

- The `EventEmitter` instance will emit its own `'newListener'` event _before_ a listener is added to its internal array of listeners.

- Listeners registered for the `'newListener'` event are passed the event name and a reference to the listener being added.

- The fact that the event is triggered before adding the listener has a subtle but important side effect: any _additional_ listeners registered to the same `name` _within_ the `'newListener'` callback are inserted _before_ the listener that is in the process of being added.

```js
eventEmitter.on("newListener", (name, reference) => {
    console.log("Added a listener");
    console.log(name);
    console.log(reference.toString());

});

eventEmitter.on("event1", (para) => {
    console.log(para);
});
//Added a listener
//event1
//(para)=>{
//    console.log(para);
//}
```

# Event : removeListener
- Same as above
- The `'removeListener'` event is emitted _after_ the `listener` is removed.

```js
eventEmitter.on("removeListener", (name, reference) => {
    console.log("Removed listener");
    console.log(name);
    console.log(reference.toString());
});
```

---

# emitter.on(eventName, listener)

- Adds the `listener` function to the end of the listeners array for the event named `eventName`. No checks are made to see if the `listener` has already been added. Multiple calls passing the same combination of `eventName` and `listener` will result in the `listener` being added, and called, multiple times.
- Returns a reference to the `EventEmitter`, so that calls can be chained.
- ALIAS :  `emitter.addListener(eventName, listener)`

```js

myEE.on('foo', () => console.log('a'));
myEE.on('foo', () => console.log('b'));
myEE.emit('foo');

//a
//b
```

# emitter.removeListener(eventName, listener)

- Removes the specified `listener` from the listener array for the event named `eventName`.
- Removes only 1 reference in the array .
- ALIAS : `emitter.off(eventName, listener)` .

# emitter.removeAllListeners(eventName)
Removes all listeners, or those of the specified `eventName`.

# emitter.emit(eventName[, ...args])

Synchronously calls each of the listeners registered for the event named `eventName`, in the order they were registered, passing the supplied arguments to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

myEmitter.emit('event', 1, 2, 3, 4, 5);

/* Output : 
Helloooo! first listener

event with parameters 1, 2 in second listener

event with parameters 1, 2, 3, 4, 5 in third listener
*/
```

# emitter.eventNames()

Returns an array listing the events for which the emitter has registered listeners. The values in the array are strings or `Symbol`s.

```js
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

# emitter.setMaxListeners(n)

By default `EventEmitter`s will print a warning if more than `10` listeners are added for a particular event. This is a useful default that helps finding memory leaks. The `emitter.setMaxListeners()` method allows the limit to be modified for this specific `EventEmitter` instance. The value can be set to `Infinity` (or `0`) to indicate an unlimited number of listeners.

```js
eventEmitter.setMaxListeners(2)  
eventEmitter.on("event1", temp);
eventEmitter.on("event1", temp);
eventEmitter.on("event1", temp);
// (node:19192) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 3 event1 listeners added to [EventEmitter]. MaxListeners is 2. Use emitter.setMaxListeners() to increase limit
```


# emitter.once(eventName, listener)

Adds a **one-time** `listener` function for the event named `eventName`. The next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```
# emitter.prependListener(eventName, listener)

Adds the `listener` function to the _beginning_ of the listeners array for the event named `eventName`. No checks are made to see if the `listener` has already been added. Multiple calls passing the same combination of `eventName` and `listener` will result in the `listener` being added, and called, multiple times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

# emitter.prependOnceListener(eventName, listener)

Adds a **one-time** `listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

# emitter.listeners(eventName)

Returns a copy of the array of listeners for the event named `eventName`.

```js
eventEmitter.on("event1", temp);
eventEmitter.on("event1", temp);
console.log(eventEmitter.listeners("event1"))
// Prints: [ [Function: temp], [Function: temp] ]
```

# emitter.rawListeners(eventName)

Returns a copy of the array of listeners for the event named `eventName`, including any wrappers (such as those created by `.once()`).



| EventEmitter Methods                       | Description                                                                                                                                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| emitter.addListener(event, listener)       | Adds a listener to the end of the listeners array for the specified event. No checks are made to see if the listener has already been added.                                                            |
| emitter.on(event, listener)                | Adds a listener to the end of the listeners array for the specified event. No checks are made to see if the listener has already been added. It can also be called as an alias of emitter.addListener() |
| emitter.once(event, listener)              | Adds a one time listener for the event. This listener is invoked only the next time the event is fired, after which it is removed                                                                       |
| emitter.removeListener(event, listener)    | Removes a listener from the listener array for the specified event. Caution: changes array indices in the listener array behind the listener.                                                           |
| emitter.removeAllListeners([event])        | Removes all listeners, or those of the specified event.                                                                                                                                                 |
| emitter.setMaxListeners(n)                 | By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.                                                                                               |
| emitter.getMaxListeners()                  | Returns the current maximum listener value for the emitter which is either set by emitter.setMaxListeners(n) or defaults to EventEmitter.defaultMaxListeners.                                           |
| emitter.listeners(event)                   | Returns a copy of the array of listeners for the specified event.                                                                                                                                       |
| emitter.emit(event[, arg1][, arg2][, ...]) | Raise the specified events with the supplied arguments.                                                                                                                                                 |
| emitter.listenerCount(type)                | Returns the number of listeners listening to the type of event.                                                                                                                                         |