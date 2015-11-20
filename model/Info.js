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
 *         (sql4) the number of new affiliations that join the CT community
 */
Info.getStatistic = function getStatistic(callback) {
    pool.getConnection(function (err, connection) {
        // year, num, count
        var sql1 = "select * from paper.count_cumulative";
        // field, count
        var sql2 = "select * from paper.count_field order by count DESC";
        // year, generation, application, model, evaluation, optimization, diagnosis, other
        var sql3 = "select * from paper.count_field_annual";
        // year, num, count
        var sql4 = "select a.year, a.num, sum(b.num) as count from paper.first_annual a " +
            "join paper.first_annual b where b.year <= a.year group by a.year";
        connection.query(sql1, function(err, results1) {
            connection.query(sql2, function(err, results2) {
                connection.query(sql3, function(err, results3) {
                    connection.query(sql4, function(err, results4) {
                        if(err) {
                            console.log("[!!!!]");
                            return;
                        }
                        else {
                            connection.release();
                            callback(err, results1, results2, results3, results4);
                        }
                    });
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
 *  result1: name, affiliation, country, email, homepage
 *  result2: the research fields that have been focused
 */
Info.getAuthorInfo = function getAuthorInfo(input, callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = "select * from paper.scholar where name = ?";
        var sql2 = "select distinct field from paper.list where author like concat('%', ?, '%')";
        connection.query(sql1, [input], function(err, result1) {
            connection.query(sql2, [input], function(err, result2) {
                if (err) {
                    console.log("[!!!!] [getAuthorInfo] Error: " + err.message);
                    return;
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
 *  para = author | affiliation
 */
Info.getRank = function getRank(para, callback) {
    var table = "" ;
    if( para == "author" || para == "affiliation" )
        table = "rank_" + para + "_archive" ;
    else {
        console.log("[!!!!] [getRank] Error: invalid parameters");
        return;
    }
    var sql = "select *, TSE*2.5 + TOSEM*2.5 + IST*1.3 + JSS*1.3 + STVR*1.3 + FSE*2.5 + ICSE*2.5 " +
        "+ ASE*1.3 + ISSRE*1 + ISSTA*1 + Other*0.8 as Score from paper." + table +
        " order by score desc limit 30";

    pool.getConnection(function (err, connection) {
        connection.query(sql, function(err, results) {
            if (err) {
                console.log("[!!!!] [getRank] Error: " + err.message);
                return;
            }
            connection.release();
            callback(err, results);
        });
    });
};