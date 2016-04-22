'use strict';

const config = require('config');
const log = require('./logger');
const registry = require('./registry');
const models = {};

Object.keys(config.datastores).forEach((dsName) => {
  const ds = config.datastores[dsName];
  if (ds.type === 'mongodb') {
    ds.schemas.forEach((schemaName) => {
      log.info(`Creating model for ${schemaName} on datastore ${dsName}`);
      models[schemaName] = registry.connections[dsName].connection.model(schemaName, require(`../schemas/${schemaName}`));
    });
  }
});

module.exports = models;
