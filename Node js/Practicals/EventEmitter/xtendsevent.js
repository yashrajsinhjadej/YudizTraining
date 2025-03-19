const EventEmitter = require("events").EventEmitter;
class MyEventEmitter extends EventEmitter {
    emitObject(event, obj = {}) {
        this.emit(event, obj);
        return obj;
    }
}
const emitter = new MyEventEmitter();
emitter.on("sayHello", function(e) {
    e.message += " World";
});
const evt = emitter.emitObject("sayHello", {message: "Hello"});
console.log(evt.message); // "Hello World"