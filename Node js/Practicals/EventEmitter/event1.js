import { EventEmitter } from 'node:events';

class EventManager extends EventEmitter {
  constructor() {
    super();
  }

  // Method for listening to an event using .on
  listenToEvent(event, callback) {
    this.on(event, callback);
  }

  // Method for emitting an event using .emit
  triggerEvent(event, data) {
    this.emit(event, data);
  }
}

// Create a new instance
const eventManager = new EventManager();

// Listening an event using .on
eventManager.listenToEvent('greeting', (message) => {
  console.log(`Message received: ${message}`);
});

// Emitting an event using .emit
eventManager.triggerEvent('greeting', 'Hello from the event!');

// Get event names using eventNames
const events = eventManager.eventNames();
console.log('Registered event names:', events);

// Listen for an event that will fire only once using .once
eventManager.once('justOnce', () => {
  console.log('This event will only be executed once.');
});

// Broadcast the event once
eventManager.triggerEvent('justOnce');
eventManager.triggerEvent('justOnce'); // This event will not fire

// Remove a specific listener using removeListener
const customListener = (data) => {
  console.log('Custom listener:', data);
};

eventManager.listenToEvent('customEvent', customListener);
eventManager.triggerEvent('customEvent', 'First call');
eventManager.removeListener('customEvent', customListener);
eventManager.triggerEvent('customEvent', 'Second call (must be silenced)');

eventManager.listenToEvent('eventToDelete', () => {
  console.log('This event will be removed');
});

eventManager.triggerEvent('eventToDelete');
// Remove all listeners from an event using removeAllListeners
eventManager.removeAllListeners('eventToDelete');
eventManager.triggerEvent('eventToDelete'); // This event will not fire