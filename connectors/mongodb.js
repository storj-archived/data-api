'use strict';

const mongoose = require('mongoose');

const MongoDB = function MongoDB(config) {
  this.config = config;
  this.connection = null;
};

MongoDB.prototype.connect = function connect(cb) {
  this.connection = mongoose.createConnection(this.config.url, this.config.options);
  this.connection.on('error', cb);
  this.connection.once('open', cb);
};

MongoDB.prototype.disconnect = function connect(cb) {
  this.connection.close(cb);
};

module.exports = MongoDB;
