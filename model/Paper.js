/**
 *  Get Paper List
 */
var mysql = require('mysql');
var logger = require('../model/Logger');

function Paper(paper) {
    this.id = paper.id;
    this.year = paper.year;
    this.type = paper.type;
    this.author = paper.author;
    this.title = paper.title;
    this.booktitle = paper.booktitle;
    this.abbr = paper.abbr;
    this.vol = paper.vol;
    this.no = paper.no;
    this.pages = paper.pages;
    this.publisher = paper.publisher;
    this.doi = paper.doi;
}

module.exports = Paper;

var pool  = mysql.createPool ({
    multipleStatements : true,
    host            : 'localhost',
    user            : 'wayne',
    password        : '123456'
});

pool.on('connection', function(connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

/*
 *  get the total number
 */
Paper.getIndexInfo = function getIndexInfo(callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = 'select count(*) as num from paper.list';
        var sql2 = 'select value from paper.configuration where name = "lastUpdateDate"';

        connection.query(sql1, function(err1, result1) {
            connection.query(sql2, function (err2, result2) {
                if (err1 || err2) {
                    logger.log('error', 'PAPER [Get IndexInfo] Error: ' + err.message);
                    console.error('PAPER [Get IndexInfo] Error: ' + err.message);
                }
                connection.release();
                callback(err, result1[0].num, result2[0].value);
            });
        });
    });
};

/*
 *  Get all paper list from $(start) to $(start) + $(step)
 */
Paper.getPaperAll = function getPaperAll(start, step, callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'SELECT SQL_CALC_FOUND_ROWS ' +
                  'id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'FROM paper.list order by year DESC, booktitle, title limit ' + start + ', ' + step +
                  '; select FOUND_ROWS() as num';
        connection.query(sql, function(err, results) {
            if (err) {
                logger.log('error', 'PAPER [Get PaperAll] Error: ' + err.message);
                console.error('PAPER [Get PaperAll] Error: ' + err.message);
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
        var sql = 'select SQL_CALC_FOUND_ROWS ' +
                  'id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
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
                logger.log('error', 'PAPER [Search Input] Error: ' + err.message);
                console.error('PAPER [Search Input] Error: ' + err.message);
            }
            connection.release();
            callback(err, results[1], results[0]);
        });
    });
};

/*
 *  Get publication list according to group and content
 *      group = scholar | institution | country | field | tag | booktitle
 *      content = particular name
 */
Paper.searchByContent = function searchByContent(group, content, start, step, callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'select SQL_CALC_FOUND_ROWS ' ;
        if( group == 'scholar' ) {
            sql += 'id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                    'from paper.list where author like CONCAT("%", ?, "%")';
        }
        else if( group == 'institution' ) {
            sql += 'distinct id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                    'from (select name, institution from paper.scholar where institution = ?) p ' +
                    'left join paper.list q on q.author like CONCAT("%", p.name, "%")';
        }
        else if( group == 'country' ) {
            sql += 'distinct id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                    'from (select name, country from paper.scholar where country = ?) p ' +
                    'left join paper.list q on q.author like CONCAT("%", p.name, "%")';
        }
        else if( group == 'field' ) {
            sql += 'id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                    'from paper.list where field = ?';
        }
        else if( group == 'tag' ) {
            sql += 'id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                    'from paper.list where tag like CONCAT("%", ?, "%")';
        }
        else if( group == 'booktitle' ) {
            // phd thesis and technical reports
            if( content == 'phdthesis' || content == 'techreport' ) {
                sql += 'id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                        'from paper.list where type = "' + content + '"' ;
            }
            // abbr
            else {
                sql += 'id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                        'from paper.list where abbr = ?' ;
            }
        }
        else {
            logger.log('error', 'PAPER - Invalid search parameter: ' + group + ', ' + content);
            return;
        }
        sql += ' order by year DESC limit ' + start + ', ' + step + '; select FOUND_ROWS() as num';

        // if there is a ? in sql
        if( sql.indexOf('?') != -1 ) {
            connection.query(sql, [content], function(err, results) {
                if (err) {
                    logger.log('error', 'PAPER [Search C-1] Error: ' + err.message);
                    console.error('PAPER [Search C-1] Error: ' + err.message);
                }
                connection.release();
                callback(err, results[1], results[0]);
            });
        }
        // else
        else {
            connection.query(sql, function(err, results) {
                if (err) {
                    logger.log('error', 'PAPER [Search C-2] Error: ' + err.message);
                    console.error('PAPER [Search C-2] Error: ' + err.message);
                }
                connection.release();
                callback(err, results[1], results[0]);
            });
        }
    });
};

/*
 *  Get all data
 */
Paper.getDataAll = function getDataAll(callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'SELECT * FROM paper.list';
        connection.query(sql, function(err, result) {
            if (err) {
                logger.log('error', 'PAPER [Get getDataAll] Error: ' + err.message);
                console.error('PAPER [Get getDataAll] Error: ' + err.message);
            }
            connection.release();
            callback(err, result);
        });
    });
};