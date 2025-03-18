const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event1') {
    // Insert a new listener in front
    myEmitter.on('event1', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event1', () => {
  console.log('A');
});

// myEmitter.prependListener('event1', () => {console.log('D')});
// myEmitter.prependListener('event1', () => {console.log('C')});
// myEmitter.prependOnceListener('event1', () => {console.log('E')});
myEmitter.emit('event1');
myEmitter.emit('event1');
//   B
//   A