'use strict';

const config = require('config');

module.exports = (clientAddress) => {
  let thisClient = null;
  console.log("config.clients: ", config.clients);
  Object.keys(config.clients).forEach((client) => {
    if (config.clients[client] === clientAddress || config.clients[client].indexOf(clientAddress) > -1) {
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

  return {client: thisClient, methods};
};
