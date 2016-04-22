'use strict';

const log = require('./logger');
const config = require('config');

module.exports = (clientAddress) => {
  let thisClient = null;
  Object.keys(config.clients).forEach((client) => {
    if (config.clients[client] === clientAddress || config.clients[client].indexOf(clientAddress) > -1) {
      thisClient = client;
    }
  });
  if (thisClient) {
    log.debug(`Identified client: ${thisClient}`);
  }

  const methods = [];
  Object.keys(config.methods).forEach((method) => {
    if (config.methods[method] === true) {
      methods.push(method);
    } else if (config.methods[method].indexOf(thisClient) > -1) {
      methods.push(method);
    }
  });

  return methods;
};
