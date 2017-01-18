'use strict';

const log = require('../../lib/logger');

const handleError = (req, res, err) => {
  log.warn(`[${req.body.id}] method: ${req.body.method} error: ${err.message} ${err.stack}`);
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
    report = Report.create(req.body.params.message);
    console.log(report)
  } catch (e) {
    return handleError(req, res, e);
  }
  console.log(report)
  report.requestID = req.body.id;
  report.save((err) => {
    console.log(err)
    if (err) {
      handleError(req, res, err);
    } else {
      log.debug('Saved report in mongo');
      report.createInElasticSearch(function createInElasticSearch(err2) {
        if (err2) {
          return handleError(req, res, err2);
        } else {
          res.send({
            id: req.body.id,
            error: null,
            result: report
          });
        }
        log.profile(`[${req.body.id}] method: ${req.body.method}`);
      });
    }
  });
};
