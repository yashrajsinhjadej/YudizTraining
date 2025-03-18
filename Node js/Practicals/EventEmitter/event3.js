const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.on('log', () => console.log('log once'));
emitter.on('log',()=>{console.log('hello world')})
const listeners = emitter.rawListeners('log');
console.log(listeners);
// console.log(logFnWrapper[0].listeners);
// logFnWrapper[0].listeners()
listeners[0]()
listeners[1]()