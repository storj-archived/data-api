'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const server = require('../server');
const uuid = require('node-uuid');

describe('Data API', () => {
  before((cb) => {
    server.start(cb);
  });

  after((cb) => {
    server.stop(cb);
  });

  it('should not respond when there is no ID on the request body', (done) => {
    request(server.app)
      .post('/')
      .send({
        method: 'list',
        params: {}
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body).to.deep.equal({});
        done();
      });
  });

  it('should respond with error when method is unknown', (done) => {
    request(server.app)
      .post('/')
      .send({
        method: 'unknown',
        id: uuid.v4(),
        params: {}
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body.error).to.exist;
        expect(res.body.result).to.not.exist;
        done();
      });
  });

  it('should process method: list', (done) => {
    request(server.app)
      .post('/')
      .send({
        method: 'list',
        id: uuid.v4(),
        params: {}
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body.error).to.not.exist;
        expect(res.body.result).to.exist;
        done();
      });
  });

  it('should process method: status', (done) => {
    request(server.app)
      .post('/')
      .send({
        method: 'status',
        id: uuid.v4(),
        params: {}
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body.error).to.not.exist;
        expect(res.body.result).to.exist;
        done();
      });
  });

  it('should process method: report.put', (done) => {
    request(server.app)
      .post('/')
      .send({
        method: 'report.put',
        id: uuid.v4(),
        params: {}
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body.error).to.not.exist;
        expect(res.body.result).to.exist;
        done();
      });
  });

});
