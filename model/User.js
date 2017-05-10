var mysql = require('mysql');
var logger = require('../model/Logger');
var config = require('../configuration');

function User () {}

var pool  = mysql.createPool ({
  host      : 'localhost',
  user      : config.user,
  password  : config.password,
  database  : config.database
});

pool.on('connection', function(connection) {
  connection.query('SET SESSION auto_increment_increment=1');
});

module.exports = User;

/* get username's appKey and secretKey fields */
User.getKeys = function (name, callback) {
  pool.getConnection(function (err, connection) {
    var sql = "SELECT appKey, secretKey FROM app WHERE name = ?";
    connection.query(sql, [name], function(err, result) {
      connection.release();
      if ( err ) {
        logger.log('error', 'User - cannot get user: ' + err.message);
      }
      callback(err, result);
    });
  });
};

