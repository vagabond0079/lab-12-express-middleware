'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const expect = require('expect');
const superagent = require('superagent');
const uuidv4 = require('uuid/v4');

const Transaction = require('../model/transaction.js');
const server = require('../lib/server.js');

const API_URL = `http://localhost:${process.env.PORT}`;

let testTransaction;

describe('testing transaction-router', () => {
  before(server.start);
  after(server.stop);

  describe('testing POST router', () => {
    after(() => Transaction.remove({}));

    let data = {
      name: 'testName',
      sendingBankRouting: Math.floor(Math.random()*1000000000),
      receivingBankRouting: Math.floor(Math.random()*1000000000),
      amount: 1000,
      timestamp: '2017-06-27T23:02:22.796Z',
      uniqueID: 20,
    };

    it('should respond with 200 when valid body request', () => {
      return superagent.post(`${API_URL}/api/transactions`)
      .send(data)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(data.name);
        expect(res.body.sendingBankRouting).toEqual(data.sendingBankRouting);
        expect(res.body.receivingBankRouting).toEqual(data.receivingBankRouting);
        expect(res.body.amount).toEqual(data.amount);
        expect(res.body.timestamp).toEqual(data.timestamp);
        expect(res.body.uniqueID).toEqual(data.uniqueID);
        expect(res.body._id).toExist();
      });
    });
    it('should respond with 400 for an invalid body', () => {
      return superagent.post(`${API_URL}/api/transactions`)
      .catch(res => {
        expect(res.status).toEqual(400);
      })
    })
    it('should respond with 409 for a uniqueID conflict', () => {
      return superagent.post(`${API_URL}/api/transactions`)
      .send({
        name: 'testName',
        sendingBankRouting: Math.floor(Math.random()*1000000000),
        receivingBankRouting: Math.floor(Math.random()*1000000000),
        amount: 1000,
        timestamp: Date.now(),
        uniqueID: data.uniqueID,
      })
      .catch(res => {
        expect(res.status).toEqual(409);
      })
    })
  })

  describe('testing GET router', () => {
    afterEach(Transaction.remove({}));
    beforeEach(() => {
      return new Transaction({
        name: 'testName',
        sendingBankRouting: Math.floor(Math.random()*1000000000),
        receivingBankRouting: Math.floor(Math.random()*1000000000),
        amount: 1000,
        timestamp: Date.now(),
        uniqueID: uuidv4(),
      });
    });
    it('should return 404 for an invalid ID', () => {
      return superagent.get()
    })
  });

});
