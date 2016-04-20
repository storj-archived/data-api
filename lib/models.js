'use strict';

const config = require('config');
const registry = require('./registry');
const models = {};

Object.keys(config.datastores).forEach((ds) => {
  if (ds.type === 'mongodb') {
    ds.schemas.forEach((schemaName) => {
      models[shemaName] = registry.connections[ds].model(schemaName, require(`../schemas/${schemaName}`));
    });
  }
});

module.exports = models;
