
// const errorCorrect = require('http-errors');
const jsonParse = require('body-parser').json();

const {Router} = require('express');
const Transaction = require('../model/transaction.js');

const transactionRouter = module.exports = new Router();

transactionRouter.post('/api/transactions', jsonParse, (req, res, next) => {
  console.log('POST api/transactions');

  new Transaction(req.body)
  .save()
  .then(transaction => res.json(transaction))
  .catch(err => {
    next(err);
  });
});
