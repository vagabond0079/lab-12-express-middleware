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
      });
    });
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
      });
    });
  });

  describe('testing GET router', () => {
    afterEach(() => Transaction.remove({}));
    beforeEach(() => {
      return new Transaction({
        name: 'testName',
        sendingBankRouting: Math.floor(Math.random()*1000000000),
        receivingBankRouting: Math.floor(Math.random()*1000000000),
        amount: 1000,
        uniqueID: uuidv4(),
      })
      .save()
      .then(transaction => {
        testTransaction = transaction;
      });
    });
    it('should return 404 for an invalid ID', () => {
      return superagent.get(`${API_URL}/api/transactions/123123`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
    it('should return 200 and transaction data', () => {
      return superagent.get(`${API_URL}/api/transactions/${testTransaction._id}`)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(testTransaction.name);
        expect(res.body.sendingBankRouting).toEqual(testTransaction.sendingBankRouting);
        expect(res.body.receivingBankRouting).toEqual(testTransaction.receivingBankRouting);
        expect(res.body.amount).toEqual(testTransaction.amount);
        expect(res.body.timestamp).toExist();
        expect(res.body.uniqueID).toEqual(testTransaction.uniqueID);
        expect(res.body._id).toExist();
      });
    });
  });


  describe('testing PUT router', () => {
    afterEach(() => Transaction.remove({}));
    beforeEach(() => {
      return new Transaction({
        name: 'testName',
        sendingBankRouting: Math.floor(Math.random()*1000000000),
        receivingBankRouting: Math.floor(Math.random()*1000000000),
        amount: 1000,
        uniqueID: uuidv4(),
      })
      .save()
      .then(transaction => {
        testTransaction = transaction;
      });
    });
    it('should return 404 for an invalid ID', () => {
      return superagent.put(`${API_URL}/api/transactions/123123`)
      .send({name: 'testPUTName'})
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
    it('should return 400 for invalid body', () => {
      return superagent.put(`${API_URL}/api/transactions/${testTransaction._id}`)
      .send()
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
    it('should return 200 and updated transaction data', () => {
      return superagent.put(`${API_URL}/api/transactions/${testTransaction._id}`)
      .send({name: 'putUpdatedName'})
      .then(res => {
        console.log('testTransaction.name', testTransaction.name);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('putUpdatedName');
        expect(res.body.sendingBankRouting).toEqual(testTransaction.sendingBankRouting);
        expect(res.body.receivingBankRouting).toEqual(testTransaction.receivingBankRouting);
        expect(res.body.amount).toEqual(testTransaction.amount);
        expect(res.body.timestamp).toExist();
        expect(res.body.uniqueID).toEqual(testTransaction.uniqueID);
        expect(res.body._id).toExist();
      });
    });
  });

  describe('testing DELETE router', () => {
    afterEach(() => Transaction.remove({}));
    beforeEach(() => {
      return new Transaction({
        name: 'testName',
        sendingBankRouting: Math.floor(Math.random()*1000000000),
        receivingBankRouting: Math.floor(Math.random()*1000000000),
        amount: 1000,
        uniqueID: uuidv4(),
      })
      .save()
      .then(transaction => {
        testTransaction = transaction;
      });
    });
    it('should return 404 for an invalid ID', () => {
      return superagent.delete(`${API_URL}/api/transactions/123123`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
    it('should return 204 for valid ID', () => {
      return superagent.delete(`${API_URL}/api/transactions/${testTransaction._id}`)
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });
  });
});
