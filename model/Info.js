var mysql = require('mysql');

module.exports = Info;

function Info() {
    this.name = "info"
}

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
 *  return (sql1) annual & cumulative number of publications
 *         (sql2) total number of each field
 *         (sql3) annual number of each filed
 */
Info.getStatistic = function getStatistic(callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = "select * from paper.count_cumulative";  // year, num, count
        var sql2 = "select * from paper.count_field order by count DESC"; // field, count
        var sql3 = "select * from paper.count_field_annual"; // year, gen, app, loc
        connection.query(sql1, function(err, results1) {
            connection.query(sql2, function(err, results2) {
                connection.query(sql3, function(err, results3) {
                    connection.release();
                    callback(err, results1, results2, results3);
                });
            });
        });
    });
};

/*
 *  get the required list from scholar table
 *  para = author | affiliation | country
 */
Info.getScholar = function getScholar(para, callback) {
    pool.getConnection(function (err, connection) {
        var sql = "" ;
        if( para == "author" )
            sql = "select name from paper.scholar order by name";
        else if( para == "affiliation" )
            sql = "select distinct affiliation, category from paper.scholar order by affiliation";
        else if( para == "country" )
            sql = "select distinct country from paper.scholar order by country";
        else {
            console.log("[!!!!] [getScholar] Error: para is invalid");
            return;
        }
        connection.query(sql, function(err, results) {
            if (err) {
                console.log("[!!!!] [getScholar] Error: " + err.message);
                return;
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
        var sql = "select name from paper.scholar order by name";
        connection.query(sql, function(err, results) {
            if (err) {
                console.log("[!!!!] [getAuthor] Error: " + err.message);
                return;
            }
            connection.release();
            callback(err, results);
        });
    });
}; */

/*
 *  get the information of particular author
 */
Info.getAuthorInfo = function getAuthorInfo(input, callback) {
    pool.getConnection(function (err, connection) {
        var sql = "select * from paper.scholar where name = ?";
        connection.query(sql, [input], function(err, result) {
            if (err) {
                console.log("[!!!!] [getAuthorInfo] Error: " + err.message);
                return;
            }
            connection.release();
            callback(err, result);
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
        var sql1 = "select * from paper.venue where type = 'article'";
        var sql2 = "select * from paper.venue where type = 'inproceedings'";
        connection.query(sql1, function(err, results1) {
            if (err) {
                console.log("[!!!!] [getVenueArticle] Error: " + err.message);
                return;
            }
            connection.query(sql2, function(err, results2) {
                if (err) {
                    console.log("[!!!!] [getVenueInproceeding] Error: " + err.message);
                    return;
                }
                connection.release();
                callback(err, results1, results2);
            });
        });
    });
};

/*
 *  get the list of rank
 */
Info.getRank = function getRank(callback) {
    pool.getConnection(function (err, connection) {
        var sql = "select *, TSE*2.5 + TOSEM*2.5 + IST*1.3 + JSS*1.3 + STVR*1.3 + FSE*2.5 + ICSE*2.5 " +
            "+ ASE*1.3 + ISSRE*1 + ISSTA*1 + Other*0.8 as Score from paper.rank_archive order by score desc limit 30";

        connection.query(sql, function(err, results) {
            if (err) {
                console.log("[!!!!] [getAuthor] Error: " + err.message);
                return;
            }
            connection.release();
            callback(err, results);
        });
    });
};