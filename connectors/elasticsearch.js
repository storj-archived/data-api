'use strict';

const log = require('../lib/logger');
const elasticsearch = require('elasticsearch');

const ElasticSearch = function ElasticSearch(options) {
  options.log = function Logger() {
    this.error = (message, meta) => {
      log.warn(`ElasticSearch: ${message} ${meta && JSON.stringify(meta) || ''}`);
    };
    this.warning = (message, meta) => {
      log.info(`ElasticSearch: ${message} ${meta && JSON.stringify(meta) || ''}`);
    };
    this.info = (message, meta) => {
      log.debug(`ElasticSearch: ${message} ${meta && JSON.stringify(meta) || ''}`);
    };
    this.debug = (message, meta) => {
      log.debug(`ElasticSearch: ${message} ${meta && JSON.stringify(meta) || ''}`);
    };
    this.trace = function () {};
  };
  this.client = new elasticsearch.Client(options);
  this.config = options;
};

ElasticSearch.prototype.connect = function connect(cb) {
  this.client.ping({
    requestTimeout: 5000
  }, (err) => {
    if (err) {
      return cb(new Error(`Could not connect to server: ${JSON.stringify(this.config)}`));
    }
    cb();
  });
};

ElasticSearch.prototype.disconnect = function disconnect(cb) {
  cb();
};

module.exports = ElasticSearch;
