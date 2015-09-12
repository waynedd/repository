var mysql = require('mysql');

function Paper(paper) {
    this.id = paper.id;
    this.bib = paper.bib;
    this.type = paper.type;
    this.year = paper.year;
    this.author = paper.author;
    this.title = paper.title;
    this.publication = paper.publication;
    this.abbr = paper.abbr;
    this.vol = paper.vol;
    this.no = paper.no;
    this.pages = paper.pages;
    this.field = paper.field;
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
        var sql = "select count(*) as num from paper.list";
        connection.query(sql, function(err, result) {
            if (err) {
                console.log("[!!!!] [getWholeNum] Error: " + err.message);
                return;
            }
            connection.release();
            callback(err, result[0].num);
        });
    });
};

/* get all paper list as results */
Paper.getPaperAll = function getPaperAll(callback) {
    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM paper.list";
        connection.query(sql, function(err, results) {
            if (err) {
                console.log("[!!!!] [getPaperAll] Error: " + err.message);
                return;
            }
            connection.release();
            callback(err, results);
        });
    });
};

/* search by input */
Paper.searchByInput = function searchByInput(input, callback) {
    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM paper.list WHERE (author like ? OR " +
                                                  "title like ? OR " +
                                                  "publication like ? OR " +
                                                  "year like ?) " +
                                                  "order by year DESC, author ASC";

        connection.query(sql, ["%"+input+"%", "%"+input+"%", "%"+input+"%", "%"+input+"%"], function(err, results) {
            if (err) {
                console.log("[!!!!] [searchByInput] Error: " + err.message);
                return;
            }
            connection.release();
            console.log(results);
            callback(err, results);
        });
    });
};