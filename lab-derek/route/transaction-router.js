
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

transactionRouter.get('/api/transactions/:id', (req, res, next) => {
  console.log('GET /api/transactions/:id');
  Transaction.findById(req.params.id)
  .then(transaction => res.json(transaction))
  .catch(next);
});

transactionRouter.put('/api/transactions/:id', jsonParse, (req, res, next) => {
  console.log('PUT /api/transactions/:id');
  console.log(req.body);
  // let options = {
  //   runValidators: true,
  //   new: true,
  // };

  Transaction.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then(transaction => res.json(transaction))
  .catch(next);
});

transactionRouter.delete('/api/transactions/:id', (req, res, next) => {
  console.log('DELETE /api/transactions/:id');
  Transaction.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
