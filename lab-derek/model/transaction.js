// Create a Object Constructor using mongoose that creates a resource with at least 3 properties
//
// it can not have the same properties as the in class sample code, or yesterdays lab
//
// make sure you include at least one propertie with the unique validator set to true
//
// Also include two other properties of your choice (like name, creationDate, etc.)
//
// use the body-parser express middleware to on POST and PUT routes
//


const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  name: {type: String, required: true},
  sendingBankRouting: {type: Number, required: true},
  receivingBankRouting: {type: Number, required: true},
  amount: {type: Number, required: true},
  timestamp: {type: Date, default: Date.now().toString()},
  uniqueID: {type: String, required: true, unique: true},
});

module.exports = mongoose.model('transaction', transactionSchema);
