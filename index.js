'use strict';

const server = require('./server');
const log = require('./lib/logger');

server.start((err) => {
  if (err) { return log.error(err); }
  log.info('Started');
});

process.on('SIGINT', () => {
  server.stop(() => {
    log.info('Stopped by SIGINT');
  });
});

// PM2 sends IPC message for graceful shutdown
process.on('message', (msg) => {
  if (msg === 'shutdown') {
    server.stop(() => {
      log.info('Stopped by PM2');
    });
  }
});
