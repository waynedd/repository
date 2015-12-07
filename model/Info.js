/**
 *  Get Info List
 */
var mysql = require('mysql');
var logger = require('../model/Logger');

function Info() {
    this.name = 'info';
}

module.exports = Info;

var pool  = mysql.createPool ({
    host     : 'localhost',
    user     : 'wayne',
    password : '123456'
});

pool.on('connection', function(connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

/*
 *  get the statistic data
 *  no = 1 : annual & cumulative number of publications
 *  no = 2 : total number of each field
 *  no = 3 : annual number of each filed
 *  no = 5 : the number of new institutions that join the CT community
 */
Info.getStatistics = function getStatistics(no, callback) {
    pool.getConnection(function (err, connection) {
        var sql = '' ;
        switch ( no ) {
            case 1 :
                sql = 'select year, num, count from paper.count_cumulative';
                break ;
            case 2 :
                sql = 'select field, count from paper.count_field order by count DESC';
                break ;
            case 3 :
                // year, num, generation, application, model, evaluation, optimization, diagnosis, other
                sql = 'select * from paper.count_field_annual';
                break ;
            case 5 :
                sql = 'select a.year, a.num, sum(b.num) as count from paper.first_annual a ' +
                    'join paper.first_annual b where b.year <= a.year group by a.year';
                break ;
            default :
                logger.log('error', 'INFO - Invalid statistic parameter: ' + no);
                break ;
        } // end switch

        connection.query(sql, function (err, results) {
            if (err) {
                logger.log('error', 'INFO [Get Statistic] Error: ' + err.message);
                console.error('INFO [Get Statistic] Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};

/*
 *  get the required list from scholar table
 *  para = author | institution | country
 */
Info.getScholar = function getScholar(para, callback) {
    pool.getConnection(function (err, connection) {
        var sql = '' ;
        if( para == 'author' )
            sql = 'select name from paper.scholar order by name';
        else if( para == 'institution' )
            sql = 'select distinct institution, category from paper.scholar order by institution';
        else if( para == 'country' )
            sql = 'select distinct country from paper.scholar order by country';
        else {
            logger.log('error', 'INFO - Invalid scholar parameter: ' + para);
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.log('error', 'INFO [Get ScholarList] Error: ' + err.message);
                console.error('[Get ScholarList] Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};

/*
 *  get the list of all authors
Info.getAuthor = function getAuthor(callback) {
    pool.getConnection(function (err, connection) {
        var sql = 'select name from paper.scholar order by name';
        connection.query(sql, function(err, results) {
            if (err) {
                console.log('[!!!!] [getAuthor] Error: ' + err.message);
                return;
            }
            connection.release();
            callback(err, results);
        });
    });
}; */

/*
 *  get the information of particular author
 *  result1: name, affiliation, country, email, homepage
 *  result2: the research fields that have been focused
 */
Info.getAuthorInfo = function getAuthorInfo(input, callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = 'select * from paper.scholar where name = ?';
        var sql2 = 'select distinct field from paper.list where author like concat("%", ?, "%")';

        connection.query(sql1, [input], function(err, result1) {
            connection.query(sql2, [input], function(err, result2) {
                if (err) {
                    logger.log('error', 'INFO [Get AuthorInfo] Error: ' + err.message);
                    console.error('INFO [Get AuthorInfo] Error: ' + err.message);
                }
                connection.release();
                callback(err, result1, result2);
            });
        });
    });
};

/*
 *  get the list of all booktitle venues
 *  results1 = article list
 *  results2 = inproceeding list
 */
Info.getVenue = function getVenue(callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = 'select * from paper.venue where type = "article"';
        var sql2 = 'select * from paper.venue where type = "inproceedings"';
        connection.query(sql1, function(err, results1) {
            if (err) {
                logger.log('error', 'INFO [Get Article] Error: ' + err.message);
                console.error('INFO [Get Article] Error: ' + err.message);
            }
            connection.query(sql2, function(err, results2) {
                if (err) {
                    logger.log('error', 'INFO [Get Inproceeding] Error: ' + err.message);
                    console.error('INFO [Get Inproceeding] Error: ' + err.message);
                }
                connection.release();
                callback(err, results1, results2);
            });
        });
    });
};

/*
 *  get the list of rank
 *  para = author | affiliation
 */
Info.getRank = function getRank(para, callback) {
    var table = '' ;
    if( para == 'author' || para == 'institution' )
        table = 'rank_' + para + '_archive' ;
    else {
        logger.log('error', 'INFO - Invalid rank parameter: ' + para);
        return;
    }

    var sql = 'select *, TSE*2.5 + TOSEM*2.5 + IST*1.3 + JSS*1.3 + STVR*1.3 + FSE*2.5 + ICSE*2.5 ' +
        '+ ASE*1.3 + ISSRE*1 + ISSTA*1 + Other*0.8 as Score from paper.' + table +
        ' order by score desc limit 30';

    pool.getConnection(function (err, connection) {
        connection.query(sql, function(err, results) {
            if (err) {
                logger.log('error', 'INFO [Get Rank] Error: ' + err.message);
                console.error('INFO [Get Rank] Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};