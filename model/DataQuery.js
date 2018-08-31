/**
 * The methods used to get data from database.
 */
var mysql = require('mysql');
var logger = require('../model/Logger');
var config = require('../configuration');

var DataQuery = function () {};

var connection = mysql.createConnection({
  host      : config.host,
  user      : config.user,
  password  : config.password,
  database  : config.database
});
connection.connect();
connection.query('select value from configuration where name = "lastTimeStamp"', function(err, result) {
  if (err) throw err;
  global.timeStamp = result[0].value;
});
connection.end();

var pool  = mysql.createPool ({
  multipleStatements : true,
  host      : config.host,
  user      : config.user,
  password  : config.password,
  database  : config.database
});

pool.on('connection', function(connection) {
  connection.query('SET SESSION auto_increment_increment=1');
});

/* common prefix */
let sql_prefix = 'id, time_stamp, type, year, author, title, booktitle, ' +
                 'abbr, vol, no, pages, publisher, doi' ;

module.exports = DataQuery;

/**
 * Get papers from $(start) to $(start) + $(step)
 * @param {number} start: start index
 * @param {number} step: length
 * @param callback
 */
DataQuery.prototype.paperList = function (start, step, callback) {
  pool.getConnection(function (err, connection) {
    var sql = 'SELECT SQL_CALC_FOUND_ROWS ' + sql_prefix + ' ' +
      'FROM list order by year DESC, booktitle, title limit ' + start + ', ' + step +
      '; select FOUND_ROWS() as num';
    connection.query(sql, function(err, result) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (paperList) Error: ' + err.message);

      callback(err, result[1], result[0]);
    });
  });
};

/**
 * Get papers that are relevant to input.
 * @param {string} input
 * @param {number} start
 * @param {number} step
 * @param callback
 */
DataQuery.prototype.searchInput = function (input, start, step, callback) {
  pool.getConnection(function (err, connection) {
    var sql = 'select SQL_CALC_FOUND_ROWS ' + sql_prefix + ' ' +
      'from list where (author like CONCAT("%", ?, "%") OR ' +
      'title like CONCAT("%", ?, "%") OR ' +
      'booktitle like CONCAT("%", ?, "%") OR ' +
      'tag like CONCAT("%", ?, "%") OR '+
      'abbr like CONCAT("%" ?, "%") OR ' +
      'year like CONCAT("%", ?, "%")' +
      ') order by year DESC, author ASC limit ' + start + ', ' + step +
      '; select FOUND_ROWS() as num';

    connection.query(sql, [input, input, input, input, input, input], function(err, result) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (searchInput) Error: ' + err.message);

      callback(err, result[1], result[0]);
    });
  });
};

/**
 * Get papers that are relevant to a particular group.
 * @param {string} group: [scholar | institution | country | field | tag | booktitle]
 * @param {string} content: particular name
 * @param {number} start
 * @param {number} step
 * @param {function} callback
 */
DataQuery.prototype.searchContent = function (group, content, start, step, callback) {
  pool.getConnection(function (err, connection) {
    var sql = 'select SQL_CALC_FOUND_ROWS ' ;
    switch (group) {
      case 'scholar':
        sql += sql_prefix + ' from list where author like CONCAT("%", ?, "%")';
        break;
      case 'institution':
        sql += 'distinct ' + sql_prefix + ' ' + 'from (select name, institution from scholar ' +
          'where institution = ?) p left join list q on q.author like CONCAT("%", p.name, "%")';
        break;
      case 'country':
        sql += 'distinct ' + sql_prefix + ' ' + 'from (select name, country from scholar ' +
          'where country = ?) p left join list q on q.author like CONCAT("%", p.name, "%")';
        break;
      case 'field':
        sql += sql_prefix + ' from list where field = ?';
        break;
      case 'tag':
        sql += sql_prefix + ' from list where tag like CONCAT("%", ?, "%")';
        break;
      case 'booktitle':
        if( content == 'phdthesis' || content == 'techreport' )
          sql += sql_prefix + ' from list where type = "' + content + '"' ;
        else
          sql += sql_prefix + ' from list where abbr = ?' ;
        break;
      default:
        logger.log('error', 'PAPER - Invalid Search Parameter: ' + group + ', ' + content);
        return;
    }
    sql += ' order by year DESC limit ' + start + ', ' + step + '; select FOUND_ROWS() as num';

    // if there is an input parameters
    if( sql.indexOf('?') != -1 ) {
      connection.query(sql, [content], function(err, result) {
        connection.release();
        if (err)
          logger.log('error', 'INFO (searchContent with input) Error: ' + err.message);

        callback(err, result[1], result[0]);
      });
    }
    else {
      connection.query(sql, function(err, result) {
        connection.release();
        if (err)
          logger.log('error', 'INFO (searchContent) Error: ' + err.message);

        callback(err, result[1], result[0]);
      });
    }
  });
};

/**
 * Get the whole paper.list table.
 * @param  callback:
 */
DataQuery.prototype.paperAll = function (callback) {
  pool.getConnection(function (err, connection) {
    var sql = 'SELECT * FROM list';
    connection.query(sql, function(err, result) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (paperAll) Error: ' + err.message);

      callback(err, result);
    });
  });
};

/**
 * Get the total number of papers and the last updating date,
 * which are used in the homepage.
 * @param callback
 */
DataQuery.prototype.indexInfo = function (callback) {
  pool.getConnection(function (err, connection) {
    var sql = 'select count(*) as num from list;' +
      'select value from configuration where name = "lastUpdateDate"';

    connection.query(sql, function(err, results) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (Get Index) Error: ' + err.message);

      callback(err, results[0][0].num, results[1][0].value);
    });
  });
};

/**
 * Get the statistic data, which is used to draw figures.
 * @param {number} no: indicates the targeted figure
 *      no = 1 : annual & cumulative number of publications
 *      no = 2 : total number of each field
 *      no = 3 : annual number of each filed
 *      no = 4 : number of scholars of each country
 *      no = 5 : the number of new institutions that join the CT community
 * @param callback
 */
DataQuery.prototype.statistics = function (no, callback) {
  pool.getConnection(function (err, connection) {
    var sql = '' ;
    switch ( no ) {
      case 1 :
        sql = 'select year, num, count from count_cumulative';
        break ;
      case 2 :
        sql = 'select field, count from count_field order by count DESC';
        break ;
      case 3 :
        sql = 'select year, num, generation, application, model, evaluation, optimization, ' +
          'diagnosis, other from count_field_annual';
        break ;
      case 4 :
        sql = 'select code, count from count_country';
        break ;
      case 5 :
        sql = 'select year, num from count_new_institution';
        break ;
      default :
        logger.log('error', 'INFO - Invalid Statistic Parameter: ' + no);
        break ;
    }

    connection.query(sql, function (err, result) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (Get Statistic) Error: ' + err.message);

      callback(err, result);
    });
  });
};

/**
 * Get the list of scholars, institutions and countries.
 * @param {string} group: [scholar | institution | country]
 * @param callback
 */
DataQuery.prototype.scholarAll = function (group, callback) {
  pool.getConnection(function (err, connection) {
    var sql = '' ;
    switch ( group ) {
      case 'scholar':
        sql = 'select name from scholar order by name';
        break;
      case 'institution':
        sql = 'select distinct institution, category from scholar order by institution';
        break;
      case 'country':
        sql = 'select distinct country from scholar order by country';
        break;
      default:
        logger.log('error', 'INFO - Invalid Scholar Parameter: ' + group);
        return;
    }

    connection.query(sql, function(err, result) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (Get Scholar List) Error: ' + err.message);

      callback(err, result);
    });
  });
};

/**
 * Get the information of a particular scholar.
 * @param {string} name
 * @param callback(err, info, field)
 *        info  = name, institution, country, email, homepage
 *        field = the research fields that are involved
 */
DataQuery.prototype.scholarInfo = function (name, callback) {
  pool.getConnection(function (err, connection) {
    var sql = 'select name, institution, country, email, homepage from scholar where name = ?;' +
      'select distinct field from list where author like concat("%", ?, "%")';

    connection.query(sql, [name, name], function(err, results) {
      connection.release();
      if ( err )
        logger.log('error', 'INFO (Get Scholar Info) Error: ' + err.message);

      callback(err, results[0], results[1]);
    });
  });
};

/**
 * Get the list of all selected venues.
 * @param callback(err, articles, inproceedings)
 */
DataQuery.prototype.venue = function getVenue(callback) {
  pool.getConnection(function (err, connection) {
    var sql = 'select booktitle, abbr from venue where type = "article";' +
      'select booktitle, abbr from venue where type = "inproceedings"';

    connection.query(sql, function(err, results) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (Get Inproceedings) Error: ' + err.message);

      callback(err, results[0], results[1]);
    });
  });
};

/**
 * Get the list of rank table.
 * @param {string} para: [author | institution]
 * @param callback
 */
DataQuery.prototype.ranking = function getRank(para, callback) {
  var table = '' ;
  if( para == 'author' || para == 'institution' )
    table = 'rank_' + para + '_archive' ;
  else {
    logger.log('error', 'INFO - Invalid Rank Parameter: ' + para);
    return;
  }

  var sql = 'select name, TSE, TOSEM, JSS, IST, EMSE, STVR, ICSE, FSE, ASE, ISSTA, ISSRE, ICSM, Other,' +
    ' TSE*3.0 + TOSEM*3.0 + JSS*1.8 + IST*1.8 + EMSE*1.8 + STVR*1.8 + ICSE*2.5 + ' +
    'FSE*2.5 + ASE*1.5 + ISSTA*1.5 + ISSRE*1.5 + ICSM*1.5 + Other*0.8 as Score ' +
    'from ' + table + ' order by score desc limit 30';

  pool.getConnection(function (err, connection) {
    connection.query(sql, function(err, results) {
      connection.release();
      if (err)
        logger.log('error', 'INFO (Get Rank) Error: ' + err.message);

      callback(err, results);
    });
  });
};


