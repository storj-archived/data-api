'use strict';

const config = require('config');

module.exports = (clientAddress) => {
  let thisClient = null;
  Object.keys(config.clients).forEach((client) => {
    if (config.clients[client] === clientAddress) {
      thisClient = client;
    }
  });

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
