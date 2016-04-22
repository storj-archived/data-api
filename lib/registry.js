'use strict';

const config = require('config');
const ds = config.datastores;
const fs = require('fs');
const async = require('async');
const log = require('./logger');

const STATE = {
  0: 'initialized',
  1: 'connecting',
  2: 'connected',
  3: 'disconnecting',
  4: 'disconnected',
  5: 'error'
};

// load connectors and methods dynamically
const load = function load(type, dir, results) {
  if (!dir) { dir = `${process.cwd()}/${type}`; }
  if (!results) { results = {}; }
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const path = `${dir}/${file}`;
    const stat = fs.statSync(path);
    if (stat && stat.isDirectory()) {
      results = load(type, path, results);
    } else {
      const fileName = path.replace(`${process.cwd()}/${type}/`, '');
      const requirePath = fileName.replace('.js', '');
      const name = requirePath.replace('/', '.');
      results[name] = require(`../${type}/${requirePath}`);
      log.info(`Registered ${type}/${requirePath}`);
    }
  });
  return results;
};

const Registry = function Registry() {
  this.connectors = load('connectors');
  this.connections = {};
  Object.keys(ds).forEach((key) => {
    const Connector = this.connectors[key];
    this.connections[key] = new Connector(ds[key]);
  });
  this.methods = load('methods');
  this.state = STATE[0];
};

Registry.prototype.connect = function connect(cb) {
  this.state = STATE[1];
  async.each(Object.keys(ds), (key, next) => {
    log.info(`Connecting to datastore: ${key} using connector: ${ds[key].type}`);
    this.connections[key].connect((err) => {
      if (err) { return next(err); }
      next();
    });
  }, (err) => {
    if (err) {
      log.error(err);
      this.state = STATE[5];
    } else {
      this.state = STATE[2];
    }
    cb(err);
  });
};

Registry.prototype.disconnect = function disconnect(cb) {
  this.state = STATE[3];
  async.each(Object.keys(this.connections), (key, next) => {
    this.connections[key].disconnect(next);
  }, (err) => {
    if (err) {
      log.error(err);
      this.state = STATE[5];
    } else {
      log.info(`Disconnected from ${Object.keys(ds).length} datastores`);
      this.state = STATE[4];
    }
    cb(err);
  });
};

module.exports = new Registry();
