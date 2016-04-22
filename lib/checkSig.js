'use strict';

const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const stringify = require('json-stable-stringify');
const log = require('./logger');

const handleError = (req, res, e) => {
  log.warn(`[${req.body.id}] method: ${req.body.method} error: Could not verify signature: ${e.message}`);
  res.status(400).send({
    id: req.body.id,
    error: { message: e.message },
    result: null
  });
  log.profile(`[${req.body.id}] method: ${req.body.method}`);
};

module.exports = (req, res, next) => {
  let message;
  let addr;
  let signature;

  try {
    signature = req.body.params.signature;
    addr = Bitcore.Address.fromPublicKeyHash(new Buffer(
      req.body.params.address, 'hex'
    ));
  } catch (e) {
    e.message = `Invalid Address: ${e.message}`;
    return handleError(req, res, e);
  }

  delete req.body.params.signature;
  message = new Message(stringify(req.body.params));

  try {
    if (!message.verify(addr, signature)) {
      throw new Error('Invalid signature');
    }
  } catch (e) {
    return handleError(req, res, e);
  }

  next();
};
