'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const config = require('config');
const log = require('../lib/logger');

const Report = new Schema({
  requestID: {type: String, required: true, unique: true},
  storage: {
    free: { type: Number, required: true },
    used: { type: Number, required: true }
  },
  bandwidth: {
    upload: { type: Number, required: true },
    download: { type: Number, required: true }
  },
  contact: {
    protocol: { type: String, required: true },
    nodeID: { type: String, required: true },
    address: { type: String, required: true },
    port: { type: Number, required: true }
  },
  timestamp: { type: Date, required: true, expires: '90d' },
  payment: { type: String, required: true },
  signature: { type: String, required: true }
});

Report.methods.getElasticSearchClient = function getElasticSearchClient() {
  const registry = require('../lib/registry');
  let client = null;
  Object.keys(config.datastores).forEach((dsName) => {
    const ds = config.datastores[dsName];
    if (ds.type === 'elasticsearch') {
      log.debug(`Found elasticsearch instance for model: ${dsName}`);
      client = registry.connections[dsName].client;
    }
  });
  return client;
};

Report.methods.createInElasticSearch = function createInElasticSearch(cb) {
  const client = this.getElasticSearchClient();
  const body = this.toJSON();
  log.debug('Creating in ElasticSearch...', body._id);
  client.create({
    index: 'data-api',
    type: 'report',
    id: body._id.toString(),
    body
  }, cb);
};

Report.methods.deleteInElasticSearch = function deleteInElasticSearch(cb) {
  const client = this.getElasticSearchClient();
  const body = this.toJSON();
  log.debug('Deleting from ElasticSearch...');
  client.delete({
    index: 'data-api',
    type: 'report',
    id: body._id.toString()
  }, cb);
};

module.exports = Report;
