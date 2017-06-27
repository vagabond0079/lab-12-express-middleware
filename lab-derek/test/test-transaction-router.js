'use strict';

require('dotenv').config({path: `${__dirname}/.test.env`});

const expect = ('expect');
const superagent = ('superagent');
const uuidv4 = require('uuid/v4');

const Transaction = require('../model/transaction.js');
const server = require('../lib/server.js');

const API_URL = process.env.API_URL;

let testTransaction;
let data = {
  name: 'testName',
  sendingBankRouting: Math.floor(Math.random()*1000000000),
  receivingBankRouting: Math.floor(Math.random()*1000000000),
  amount: 1000,
  timestamp: Date.now(),
  uniqueID: uuidv4(),
};

describe('testing transaction-router', () => {
  before(server.start());
  after(server.start());
  describe('testing POST router', () => {
    it('should respond with 200 when valid body request', () => {
      return superagent.post(`${API_URL}/api/transactions`)
      .send(data)
      .then(transaction => {
        testTransaction = transaction;
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.name).toEqual(data.name);
        expect(res.sendingBankRouting).toEqual(data.sendingBankRouting);
        expect(res.receivingBankRouting).toEqual(data.receivingBankRouting);
        expect(res.amount).toEqual(data.amount);
        expect(res.timestamp).toEqual(data.timestamp);
        expect(res.uniqueID).toEqual(data.uniqueID);
      })
    })
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
})
