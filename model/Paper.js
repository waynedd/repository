/**
 * The methods used to update database.
 */
var mysql = require('mysql');
var fs = require('fs');
var logger = require('../model/Logger');
var config = require('../configuration');

function Paper() {
  this.name = 'paper';
}

var pool  = mysql.createPool ({
  multipleStatements: true,
  host      : 'localhost',
  user      : config.user,
  password  : config.password,
  database  : config.database
});

pool.on('connection', function(connection) {
  connection.query('SET SESSION auto_increment_increment=1');
});


/**
 *  Insert new papers into the database.
 *  @param {list} paper: a list of papers
 *  @param {string} timeStamp: the updated time stamp of the database
 *  @param {string} indexDate: the updated date shown in the homepage
 *  @param callback
 */
Paper.updatePaper = function (paper, timeStamp, indexDate, callback) {
  // insert into list table
  var sql = 'INSERT INTO list (time_stamp, year, type, author, title, field, ' +
    'tag, booktitle, abbr, vol, no, pages, publisher, doi) VALUES ?';
  var values = [];
  paper.forEach( function (each) {
    values.push([timeStamp, each.year, each.type, each.author, each.title,
                 each.field, each.tag, each.booktitle, each.abbr, each.vol, each.no,
                 each.pages, each.publisher, each.doi]);
  });

  // update configuration and rank table
  var s0 = "UPDATE configuration SET value = ? WHERE name = 'lastTimeStamp';\n" +
           "UPDATE configuration SET value = ? WHERE name = 'lastUpdateDate';";
  var s1 = fs.readFileSync(__dirname + '/sql/create_rank_institution_archive.sql', 'utf8');
  var s2 = fs.readFileSync(__dirname + '/sql/create_rank_scholar_archive.sql', 'utf8');
  var sql3 = s0 + '\n' + s1 + '\n' + s2 ;

  // do updating
  pool.getConnection(function (err, connection) {
    connection.query(sql, [values], function(err, state1) {
      if (err)
        logger.log('error', 'PAPER (Insert Paper) Error: ' + err.message);

      connection.query(sql3, [timeStamp, indexDate], function (err, state2) {
        connection.release();
        if (err)
          logger.log('error', 'PAPER (Update Configuration & Rank) Error: ' + err.message);

        callback(err, state1, state2);
      });
    });
  });
};


/**
 * Insert new scholars into the database.
 * @param {list} scholar: a list of scholars
 * @param callback
 */
Paper.updateScholar = function (scholar, callback) {
  // insert into scholar table
  var sql = 'INSERT INTO scholar (name, institution, category, country, email, homepage) VALUES ? ';
  var values = [];
  scholar.forEach( function (each) {
    values.push([each.name, each.institution, each.category, each.country, each.email, each.homepage]);
  });

  // do updating
  pool.getConnection(function (err, connection) {
    connection.query(sql, [values], function(err, state) {
      connection.release();
      if (err)
        logger.log('error', 'PAPER (Insert Scholar) Error: ' + err.message);

      callback(err, state);
    });
  });
};

module.exports = Paper;
