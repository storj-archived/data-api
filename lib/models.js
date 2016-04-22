'use strict';

const config = require('config');
const log = require('./logger');
const registry = require('./registry');
const models = {};

Object.keys(config.datastores).forEach((dsName) => {
  const ds = config.datastores[dsName];
  if (ds.type === 'mongodb') {
    ds.schemas.forEach((schemaName) => {
      models[schemaName] = registry.connections[dsName].connection.model(schemaName, require(`../schemas/${schemaName}`));
      log.debug(`Created model for ${schemaName} on datastore ${dsName}`);

    });
  }
});

module.exports = models;
