/**
 *  The methods used to get paper list
 */
var mysql = require('mysql');
var logger = require('../model/Logger');

module.exports = Paper;

function Paper() {
    this.name = 'paper';
}

var pool  = mysql.createPool ({
    multipleStatements : true,
    host            : 'localhost',
    user            : 'wayne',
    password        : '123456'
});

function setTimeStamp() {
    var connection = mysql.createConnection({
        host            : 'localhost',
        user            : 'wayne',
        password        : '123456'
    });
    connection.connect();
    connection.query('select value from paper.configuration where name = "lastTimeStamp"', function(err, result) {
        Paper.thisStamp = result[0].value;
    });
    connection.end();
}

Paper.thisStamp = "0000-00-00" ;
setTimeStamp();

var sql_prefix = "id, time_stamp, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi" ;

pool.on('connection', function(connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

/*
 *  Get papers from $(start) to $(start) + $(step),
 *  where $(start) and $(step) are determined by current page.
 */
Paper.getPaperAll = function getPaperAll(start, step, callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'SELECT SQL_CALC_FOUND_ROWS ' + sql_prefix + ' ' +
                  'FROM paper.list order by year DESC, booktitle, title limit ' + start + ', ' + step +
                  '; select FOUND_ROWS() as num';
        connection.query(sql, function(err, results) {
            if (err) {
                logger.log('error', 'PAPER (Paper All) Error: ' + err.message);
            }
            connection.release();
            callback(err, results[1], results[0]);
        });
    });
};

/*
 *  Search by input
 */
Paper.searchByInput = function searchByInput(content, start, step, callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'select SQL_CALC_FOUND_ROWS ' + sql_prefix + ' ' +
                  'from paper.list where (author like CONCAT("%", ?, "%") OR ' +
                  'title like CONCAT("%", ?, "%") OR ' +
                  'booktitle like CONCAT("%", ?, "%") OR ' +
                  'tag like CONCAT("%", ?, "%") OR '+
                  'abbr like CONCAT("%" ?, "%") OR ' +
                  'year like CONCAT("%", ?, "%")' +
                  ') order by year DESC, author ASC limit ' + start + ', ' + step +
                  '; select FOUND_ROWS() as num';

        connection.query(sql, [content, content, content, content, content, content], function(err, results) {
            if (err) {
                logger.log('error', 'PAPER (Search Input) Error: ' + err.message);
            }
            connection.release();
            callback(err, results[1], results[0]);
        });
    });
};

/*
 *  Get papers according to group and content,
 *  where group = scholar | institution | country | field | tag | booktitle
 *        content = particular name
 */
Paper.searchByContent = function searchByContent(group, content, start, step, callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'select SQL_CALC_FOUND_ROWS ' ;
        // $(content) is in the author list
        if( group == 'scholar' ) {
            sql += sql_prefix + ' from paper.list where author like CONCAT("%", ?, "%")';
        }
        // $(content) is one of the named institutions
        else if( group == 'institution' ) {
            sql += 'distinct ' + sql_prefix + ' ' + 'from (select name, institution from paper.scholar where institution = ?) p ' +
                    'left join paper.list q on q.author like CONCAT("%", p.name, "%")';
        }
        // $(content) is the country of named institutions
        else if( group == 'country' ) {
            sql += 'distinct ' + sql_prefix + ' ' + 'from (select name, country from paper.scholar where country = ?) p ' +
                    'left join paper.list q on q.author like CONCAT("%", p.name, "%")';
        }
        // $(content) is the filed
        else if( group == 'field' ) {
            sql += sql_prefix + ' from paper.list where field = ?';
        }
        // $(content) is one of the tags
        else if( group == 'tag' ) {
            sql += sql_prefix + ' from paper.list where tag like CONCAT("%", ?, "%")';
        }
        // $(content) is the booktitle
        else if( group == 'booktitle' ) {
            // phd thesis and technical reports
            if( content == 'phdthesis' || content == 'techreport' ) {
                sql += sql_prefix + ' from paper.list where type = "' + content + '"' ;
            }
            // abbr
            else {
                sql += sql_prefix + ' from paper.list where abbr = ?' ;
            }
        }
        else {
            logger.log('error', 'PAPER - Invalid Search Parameter: ' + group + ', ' + content);
            return;
        }
        sql += ' order by year DESC limit ' + start + ', ' + step + '; select FOUND_ROWS() as num';

        // if there is a ? in sql (i.e. with input parameters)
        if( sql.indexOf('?') != -1 ) {
            connection.query(sql, [content], function(err, results) {
                if (err) {
                    logger.log('error', 'PAPER (Search Content-1) Error: ' + err.message);
                }
                connection.release();
                callback(err, results[1], results[0]);
            });
        }
        // else
        else {
            connection.query(sql, function(err, results) {
                if (err) {
                    logger.log('error', 'PAPER (Search Content-1) Error: ' + err.message);
                }
                connection.release();
                callback(err, results[1], results[0]);
            });
        }
    });
};

/*
 *  Get the whole paper table
 */
Paper.getPaperTable = function getPaperTable(callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'SELECT * FROM paper.list';
        connection.query(sql, function(err, result) {
            if (err) {
                logger.log('error', 'PAPER [Get Table] Error: ' + err.message);
            }
            connection.release();
            callback(err, result);
        });
    });
};