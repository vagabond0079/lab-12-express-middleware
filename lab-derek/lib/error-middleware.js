'use strict';

module.exports = (err, req, res, next) => {
  console.error(err.message);

  if(err.message.toLowerCase().includes('validation failed:'))
    return res.sendStatus(400);

  if(err.message.toLowerCase().includes('duplicate key'))
    return res.sendStatus(409);
};
