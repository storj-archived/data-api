'use strict';

const config = require('config');
const registry = require('./lib/registry');
const app = require('./app');
const log = require('./lib/logger');
require('heapdump');
let server;

const start = (cb) => {
  registry.connect((err) => {
    if (err) {
      throw err;
    }
    log.info(`Server listening on ${config.PORT}`);
    server = app.listen(config.PORT, cb);
  });
};

const stop = (cb) => {
  registry.disconnect((err) => {
    if (err) {
      log.error(err);
      return cb(err);
    }
    server.close(cb);
  });
};

module.exports = {start, stop, app};
