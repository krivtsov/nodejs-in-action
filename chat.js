/* eslint-disable func-names */
const events = require('events');
const net = require('net');

const channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function (id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (id !== senderId) {
      this.clients[id].write(message);
    }
  };
  this.on('broadcast', this.subscriptions[id]);
});

channel.on('join', function (id, client) {
  const welcome = `Welcome! Guest online: ${this.listeners('broadcast').length}`;
  client.write(`${welcome}\n`);
});

channel.on('error', err => console.log(`ERROR: ${err.message}`));
channel.emit('error', new Error('Something id wrong.'));

channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, `${id} has left the chatroom.\n`);
});

channel.on('shutdown', () => {
  channel.emit('broadcast', '', 'The server has shut down. \n');
  channel.removeAllListeners('broadcast');
});

const server = net.createServer((client) => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  channel.emit('join', id, client);
  client.on('data', (data) => {
    const dataString = data.toString();
    if (dataString === 'shutdown\r\n') {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, dataString);
  });
  client.on('close', () => {
    channel.emit('leave', id);
  });
});
server.listen(8888);
