'use strict';

const Report = require('../../lib/models').report;
const log = require('../../lib/logger');

module.exports = (req, res) => {
  const report = new Report(req.body.params);
  report.save((err) => {
    if (err) {
      log.error(err);
      res.status(500).send({
        id: req.body.id,
        error: 'Error saving report',
        result: null
      });
    } else {
      res.send({
        id: req.body.id,
        error: null,
        result: report
      });
    }
    log.profile(`[request: ${req.body.id}] method: ${req.body.method}`);
  });
};
