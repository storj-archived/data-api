'use strict';

const config = require('config');
const registry = require('./lib/registry');
const express = require('express');
const bodyParser = require('body-parser');
const log = require('./lib/logger');
const checkSig = require('./lib/checkSig');

const app = express();
app.use(bodyParser.json({limit: config.limits.bodyParser}));

const clientMethods = require('./lib/clientMethods');

app.post('/', (req, res) => {
  if (req.body && req.body.id && req.body.method && registry.methods[req.body.method]) {
    log.profile(`[${req.body.id}] method: ${req.body.method}`);
    const client = clientMethods(req.body.params.address).client;
    log.info(`[${req.body.id}] method: ${req.body.method} client: ${client}`);
    const methods = clientMethods(req.body.params.address).methods;
    if (methods.indexOf(req.body.method) > -1) {
      checkSig(req, res, () => {
        registry.methods[req.body.method](req, res);
      });
    } else {
      const errString = `client ${req.body.params.address} not allowed to use ${req.body.method}`;
      res.send({
        id: req.body.id,
        error: errString
      });
      log.warn(`[${req.body.id}] ${errString}`);
      log.profile(`[${req.body.id}] method: ${req.body.method}`);
    }
  } else if (req.body.id) {
    log.debug(`[${req.body.id}] Unknown method: ${req.body.method}`);
    res.send({id: req.body.id, error: `Unknown method: ${req.body.method}`, result: null});
  } else {
    log.debug(`[N/A] Invalid Missing request ID`);
    // json rpc spec says not to reply here (no id)
    res.end();
  }
});

module.exports = app;
