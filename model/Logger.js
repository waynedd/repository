/**
 *  wintson logger
 */
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: '../logs/repository.log'
        })
    ]
});

module.exports = logger;
