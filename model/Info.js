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
 *  return (sql1) annual & cumulative
 *         (sql2) fieldCount
 *         (sql3) topThree
 */
Info.getStatistic = function getStatistic(callback) {
    pool.getConnection(function (err, connection) {
        var sql1 = "select * from paper.cumulative";  // year, num, count
        var sql2 = "select * from paper.fieldcount order by count DESC"; // field, count
        var sql3 = "select * from paper.topthree"; // year, gen, app, loc
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
 *  get the list of all authors
 */
Info.getAuthor = function getAuthor(callback) {
    pool.getConnection(function (err, connection) {
        var sql = "select name from paper.listauthor order by name";
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

/*
 *  get the information of particular author
 */
Info.getAuthorInfo = function getAuthorInfo(input, callback) {
    pool.getConnection(function (err, connection) {
        var sql = "select * from paper.listauthor where name = ?";
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
        var sql1 = "select * from paper.listpub where type = 'article'";
        var sql2 = "select * from paper.listpub where type = 'inproceedings'";
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
        var sql = "select *, TSE*5 + TOSEM*5 + ESE*3 + IST*3 + JSS*3 + STVR*3 + FSE*5 + ICSE*5 + ASE*5 + ISSRE*3 + ISSTA*3 + ICSM*3 + Other as Score from paper.rank order by score desc limit 30";

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