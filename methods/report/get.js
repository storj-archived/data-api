'use strict';

const log = require('../../lib/logger');

const handleError = (req, res, err) => {
  log.warn(`[${req.body.id}] method: ${req.body.method} error: ${err.message}"`);
  res.status(500).send({
    id: req.body.id,
    error: 'Error getting reports',
    result: null
  });
  log.profile(`[${req.body.id}] method: ${req.body.method}`);
};

module.exports = (req, res) => {
  const Report = require('../../lib/models').report;
  const skip = req.body.params.message.skip || 0;
  const limit = req.body.params.message.limit || 100;

  Report.find(req.body.params.message).skip(skip).limit(limit).exec((err, reports) => {
    if (err) {
      return handleError(req, res, err);
    } else {
      res.send({
        id: req.body.id,
        error: null,
        result: {
          reports,
          skip,
          limit
        }
      });
    }
    log.profile(`[${req.body.id}] method: ${req.body.method}`);
  });
};
