/**
 *  winston logger
 */
var winston = require('winston');

var logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: 'logs/repository.log'
    })
  ]
});

module.exports = logger;
