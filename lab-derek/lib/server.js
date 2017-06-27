'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

let server;
const app = express();

// app.use(require('../route/transaction-router.js'));
// app.use(require('./error-middleware.js'));

let serverControl = module.exports = {};

serverControl.start = () => {
  return new Promise((resolve, reject) => {
    if(!server || !server.isOn){
      server = app.listen(process.env.PORT, () => {
        console.log('server is up on ', process.env.PORT);
        server.isON = true;
        resolve();
      });
      return;
    }
    reject();
  });
};

serverControl.stop = () => {
  return new Promise((resolve, reject) => {
    if(server && server.isOn){
      server.close( () => {
        console.log('server is down');
        server.isOn = false;
        resolve();
      });
      return;
    }
    reject();
  });
};
