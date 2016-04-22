'use strict';

const log = require('../../lib/logger');

const handleError = (req, res, err) => {
  log.warn(`[${req.body.id}] method: ${req.body.method} error: ${err.message}"`);
  res.status(500).send({
    id: req.body.id,
    error: 'Error saving report',
    result: null
  });
  log.profile(`[${req.body.id}] method: ${req.body.method}`);
};

module.exports = (req, res) => {
  const Report = require('../../lib/models').report;
  let report;
  try {
    report = new Report(req.body.params.message);
  } catch (e) {
    return handleError(req, res, e);
  }
  report.requestID = req.body.id;
  report.save((err) => {
    if (err) {
      return handleError(req, res, err);
    } else {
      res.send({
        id: req.body.id,
        error: null,
        result: report
      });
    }
    log.profile(`[${req.body.id}] method: ${req.body.method}`);
  });
};
