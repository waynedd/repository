/**
 *  The methods used to get additional information
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
 *  Get the total number and the last updated date,
 *  which are used in the index page.
 */
Info.getIndexInfo = function getIndexInfo(callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = 'select count(*) as num from paper.list';
        var sql2 = 'select value from paper.configuration where name = "lastUpdateDate"';

        connection.query(sql1, function(err1, result1) {
            connection.query(sql2, function (err2, result2) {
                if (err1 || err2) {
                    logger.log('error', 'Info (Get Index) Error: ' + err.message);
                }
                connection.release();
                callback(err, result1[0].num, result2[0].value);
            });
        });
    });
};

/*
 *  Get the statistic data, which is used to draw figures.
 *      no = 1 : annual & cumulative number of publications
 *      no = 2 : total number of each field
 *      no = 3 : annual number of each filed
 *      no = 4 : number of scholars of each country
 *      no = 5 : the number of new institutions that join the CT community
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
                sql = 'select year, num, generation, application, model, evaluation, optimization, ' +
                      'diagnosis, other from paper.count_field_annual';
                break ;
            case 4 :
                sql = 'select code, count from paper.count_country';
                break ;
            case 5 :
                //sql = 'select a.year, a.num, sum(b.num) as count from paper.first_annual a ' +
                //      'join paper.first_annual b where b.year <= a.year group by a.year';
                sql = 'select year, num from paper.count_new_institution';
                break ;
            default :
                logger.log('error', 'INFO - Invalid Statistic Parameter: ' + no);
                break ;
        }

        connection.query(sql, function (err, results) {
            if (err) {
                logger.log('error', 'INFO (Get Statistic) Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};

/*
 *  Get the required data from the scholar table
 *      para = scholar | institution | country
 */
Info.getScholar = function getScholar(para, callback) {
    pool.getConnection(function (err, connection) {
        var sql = '' ;
        // all scholars
        if( para == 'scholar' )
            sql = 'select name from paper.scholar order by name';
        // all institutions
        else if( para == 'institution' )
            sql = 'select distinct institution, category from paper.scholar order by institution';
        // all countries
        else if( para == 'country' )
            sql = 'select distinct country from paper.scholar order by country';
        else {
            logger.log('error', 'INFO - Invalid Scholar Parameter: ' + para);
            return;
        }

        connection.query(sql, function(err, results) {
            if (err) {
                logger.log('error', 'INFO (Get Scholar List) Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};

/*
 *  Get the information of particular scholar
 *      result1: name, institution, country, email, homepage
 *      result2: the research fields that have been focused
 */
Info.getScholarInfo = function getScholarInfo(input, callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = 'select name, institution, country, email, homepage from paper.scholar where name = ?';
        var sql2 = 'select distinct field from paper.list where author like concat("%", ?, "%")';

        connection.query(sql1, [input], function(err, result1) {
            connection.query(sql2, [input], function(err, result2) {
                if (err) {
                    logger.log('error', 'INFO (Get Scholar Info) Error: ' + err.message);
                }
                connection.release();
                callback(err, result1, result2);
            });
        });
    });
};

/*
 *  Get the list of all booktitle venues
 *      results1 = article list
 *      results2 = inproceedings list
 */
Info.getVenue = function getVenue(callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = 'select booktitle, abbr from paper.venue where type = "article"';
        var sql2 = 'select booktitle, abbr from paper.venue where type = "inproceedings"';
        connection.query(sql1, function(err, results1) {
            if (err) {
                logger.log('error', 'INFO (Get Article) Error: ' + err.message);
            }
            connection.query(sql2, function(err, results2) {
                if (err) {
                    logger.log('error', 'INFO (Get Inproceedings) Error: ' + err.message);
                }
                connection.release();
                callback(err, results1, results2);
            });
        });
    });
};

/*
 *  Get the list of rank
 *      para = author | affiliation
 */
Info.getRank = function getRank(para, callback) {
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
        'from paper.' + table + ' order by score desc limit 30';

    pool.getConnection(function (err, connection) {
        connection.query(sql, function(err, results) {
            if (err) {
                logger.log('error', 'INFO (Get Rank) Error: ' + err.message);
            }
            connection.release();
            callback(err, results);
        });
    });
};