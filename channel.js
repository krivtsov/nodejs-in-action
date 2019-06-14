const { EventEmitter } = require('events');

const channel = new EventEmitter();

channel.on('join', () => {
  console.log('Welcome!');
});
channel.emit('join');
