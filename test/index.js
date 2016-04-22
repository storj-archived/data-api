'use strict';

const config = require('config');
const request = require('supertest');
const expect = require('chai').expect;

const server = require('../server');
const uuid = require('node-uuid');

const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const ecies = require('bitcore-ecies');
const _ = require('lodash').mixin(require('lodash-keyarrange'));
const privateKey = new Bitcore.PrivateKey();

describe('Data API', () => {
  before((cb) => {
    config.clients.statusify = [
      Bitcore.crypto.Hash.sha256ripemd160(privateKey.publicKey.toBuffer()).toString('hex')
    ];
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
    const testPOST = {
      method: 'list',
      id: uuid.v4(),
      params: {
        address: Bitcore.crypto.Hash.sha256ripemd160(privateKey.publicKey.toBuffer()).toString('hex')
      }
    };

    const paramsSorted = _.keyArrangeDeep(testPOST.params);
    testPOST.params.signature = new Message(JSON.stringify(paramsSorted)).sign(privateKey);

    request(server.app)
      .post('/')
      .send(testPOST)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body.error).to.not.exist;
        expect(res.body.result).to.exist;
        done();
      });
  });

  it('should process method: status', (done) => {
    const testPOST = {
      method: 'status',
      id: uuid.v4(),
      params: {
        address: Bitcore.crypto.Hash.sha256ripemd160(privateKey.publicKey.toBuffer()).toString('hex')
      }
    };

    const paramsSorted = _.keyArrangeDeep(testPOST.params);
    testPOST.params.signature = new Message(JSON.stringify(paramsSorted)).sign(privateKey);

    request(server.app)
      .post('/')
      .send(testPOST)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body.error).to.not.exist;
        expect(res.body.result).to.exist;
        done();
      });
  });

  describe('Protected Methods', () => {

    before((cb) => {
      cb();
    });

    after((cb) => {
      cb();
    });

    it('should not process method: report.put without an accepted address', (done) => {
      const testPOST = {
        method: 'report.put',
        id: uuid.v4(),
        params: {
          address: 'someotherfakeaddress',
        }
      };

      const paramsSorted = _.keyArrangeDeep(testPOST.params);
      testPOST.params.signature = new Message(JSON.stringify(paramsSorted)).sign(privateKey);

      request(server.app)
        .post('/')
        .send(testPOST)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.error).to.exist;
          expect(res.body.result).to.not.exist;
          done();
        });
    });

    it('should process method: report.put with an accepted address', (done) => {
      const testPOST = {
        method: 'report.put',
        id: uuid.v4(),
        params: {
          address: Bitcore.crypto.Hash.sha256ripemd160(privateKey.publicKey.toBuffer()).toString('hex'),
          message: {
            storage: {
              free: 5,
              used: 5
            },
            bandwidth: {
              upload: 5,
              download: 5
            },
            contact: {
              protocol: 'https',
              nodeID: 'somefakeid',
              address: '127.0.0.1',
              port: 5000
            },
            timestamp: Date.now(),
            payment: 'ijwfeijsefkjsdfkwekfmwkefwef'
          }
        }
      }

      const paramsSorted = _.keyArrangeDeep(testPOST.params);
      testPOST.params.signature = new Message(JSON.stringify(paramsSorted)).sign(privateKey);

      request(server.app)
        .post('/')
        .send(testPOST)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.error).to.not.exist;
          expect(res.body.result).to.exist;
          done();
        });
    });
  });
});
