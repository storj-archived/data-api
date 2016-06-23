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

const DataAPIIndexTemplate = {
  "string_fields" : {
    "match" : "*",
    "match_mapping_type" : "string",
    "mapping" : {
      "type" : "string", "index" : "analyzed", "omit_norms" : true,
      "fields" : {
        "raw" : {"type": "string", "index" : "not_analyzed", "ignore_above" : 256}
      }
    }
  }
};

Report.statics.create = function create(data) {
  const report = new this(data.params);
  report.requestID = data.id;
  log.debug(`Create report from ${JSON.stringify(report, null, 2)}`);
  return report;
};

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

Report.methods.createIndexTemplate = function createIndexTemplate(cb) {
  const client = this.getElasticSearchClient();
  log.debug('Creating index template for report');
  client.indices.putTemplate({
    name: 'report',
    reate: true,
    body: DataAPIIndexTemplate
  }, cb);
};

Report.methods.createInElasticSearch = function createInElasticSearch(cb) {
  const client = this.getElasticSearchClient();
  const body = this.toJSON();
  const id = body._id.toString();
  delete body._id;
  log.debug('Creating in ElasticSearch...', id);
  client.create({
    index: 'data-api',
    type: 'report',
    id: id,
    body
  }, cb);
};

Report.methods.deleteInElasticSearch = function deleteInElasticSearch(cb) {
  const client = this.getElasticSearchClient();
  const body = this.toJSON();
  const id = body._id.toString();
  log.debug('Deleting from ElasticSearch...');
  client.delete({
    index: 'data-api',
    type: 'report',
    id: id
  }, cb);
};

module.exports = Report;
