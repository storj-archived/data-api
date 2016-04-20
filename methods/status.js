'use strict';

const registry = require('../lib/registry');
const log = require('../lib/logger');

module.exports = function (req, res) {

  const status = {
    state: registry.state,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  };

  res.send({
    id: req.body.id,
    error: null,
    result: status
  });

  log.profile(`[request: ${req.body.id}] method: ${req.body.method}`);
};
