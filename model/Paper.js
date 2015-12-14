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
    host     : 'localhost',
    user     : 'wayne',
    password : '123456'
});

pool.on('connection', function(connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

/* get the whole number as result[0].num */
Paper.getWholeNum = function getWholeNum(callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'select count(*) as num from paper.list';
        connection.query(sql, function(err, result) {
            if (err) {
                logger.log('error', 'PAPER [Get WholeNum] Error: ' + err.message);
                console.error('PAPER [Get WholeNum] Error: ' + err.message);
            }
            connection.release();
            callback(err, result[0].num);
        });
    });
};

/* get all paper list as results */
Paper.getPaperAll = function getPaperAll(callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'SELECT id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'FROM paper.list order by year DESC, booktitle, title';
        connection.query(sql, function(err, results) {
            if (err) {
                logger.log('error', 'PAPER [Get PaperAll] Error: ' + err.message);
                console.error('PAPER [Get PaperAll] Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};

/* search by input */
Paper.searchByInput = function searchByInput(input, callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'select id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'from paper.list WHERE (author like CONCAT("%", ?, "%") OR ' +
                  'title like CONCAT("%", ?, "%") OR ' +
                  'booktitle like CONCAT("%", ?, "%") OR ' +
                  'tag like CONCAT("%", ?, "%") OR '+
                  'year like CONCAT("%", ?, "%")) ' +
                  'order by year DESC, author ASC';

        connection.query(sql, [input, input, input, input, input], function(err, results) {
            if (err) {
                logger.log('error', 'PAPER [Search Input] Error: ' + err.message);
                console.error('PAPER [Search Input] Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};

/*
 *  get paper list according to
 *  group = author | institution | country | field | subfield | booktitle
 *  content
 */
Paper.searchByContent = function searchByContent(group, content, callback) {
    pool.getConnection(function (err, connection) {
        var sql = '' ;
        if( group == 'scholar' ) {
            sql = 'select id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'from paper.list where author like CONCAT("%", ?, "%")';
        }
        else if( group == 'institution' ) {
            sql = 'select distinct id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'from (select name, institution from paper.scholar where institution = ?) p ' +
                  'left join paper.list q on q.author like CONCAT("%", p.name, "%")';
        }
        else if( group == 'country' ) {
            sql = 'select distinct id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'from (select name, country from paper.scholar where country = ?) p ' +
                  'left join paper.list q on q.author like CONCAT("%", p.name, "%")';
        }
        else if( group == 'field' ) {
            sql = 'select id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'from paper.list where field = ?';
        }
        else if( group == 'tag' ) {
            sql = 'select id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                  'from paper.list where tag like CONCAT("%", ?, "%")';
        }
        else if( group == 'booktitle' ) {
            // phd thesis and technical reports
            if( content == 'phdthesis' || content == 'techreport' ) {
                sql = 'select id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                      'from paper.list where type = "' + content + '"' ;
            }
            // abbr
            else {
                sql = 'select id, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, doi ' +
                      'from paper.list where abbr = ?' ;
            }
        }
        else {
            logger.log('error', 'PAPER - Invalid search parameter: ' + group + ', ' + content);
            return;
        }
        sql += ' order by year DESC' ;

        // if there is a ? in sql
        if( sql.indexOf('?') != -1 ) {
            connection.query(sql, [content], function(err, results) {
                if (err) {
                    logger.log('error', 'PAPER [Search C-1] Error: ' + err.message);
                    console.error('PAPER [Search C-1] Error: ' + err.message);
                }
                connection.release();
                callback(err, results);
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
                callback(err, results);
            });
        }
    });
};