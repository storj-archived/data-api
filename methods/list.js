'use strict';

const log = require('../lib/logger');
const clientMethods = require('../lib/clientMethods');

module.exports = function (req, res) {
  const methods = clientMethods(req.body.pubkey);
  
  res.send({
    id: req.body.id,
    error: null,
    result: methods
  });

  log.profile(`[request: ${req.body.id}] method: ${req.body.method}`);
};
