// Paper
var mysql = require('mysql');

function Paper(paper) {
    this.id = paper.id;
    this.bib = paper.bib;
    this.type = paper.type;
    this.year = paper.year;
    this.author = paper.author;
    this.title = paper.title;
    this.booktitle = paper.booktitle;
    this.abbr = paper.abbr;
    this.vol = paper.vol;
    this.no = paper.no;
    this.pages = paper.pages;
    this.publisher = paper.publisher;
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
                console.error("[getWholeNum] Error: " + err.message);
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
        var sql = "SELECT * FROM paper.list order by year DESC";
        connection.query(sql, function(err, results) {
            if (err) {
                console.error("[getPaperAll] Error: " + err.message);
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
                                                  "booktitle like ? OR " +
                                                  "year like ?) " +
                                                  "order by year DESC, author ASC";

        connection.query(sql, ["%"+input+"%", "%"+input+"%", "%"+input+"%", "%"+input+"%"], function(err, results) {
            if (err) {
                console.error("[searchByInput] Error: " + err.message);
                return;
            }
            connection.release();
            callback(err, results);
        });
    });
};

/*
 *  get paper list according to
 *  group = author | affiliation | country | field | subfield | booktitle
 *  content
 */
Paper.searchByContent = function searchByContent(group, content, callback) {
    pool.getConnection(function (err, connection) {
        var sql = "" ;
        if( group == "author" ) {
            sql = "select * from paper.list where author LIKE ?";
        }
        else if( group == "affiliation" ) {
            sql = "select distinct id, bib, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, field, subfield, doi " +
                "from (select name, affiliation from paper.scholar where affiliation = ?) p " +
                "left join paper.list q on q.author like CONCAT('%', p.name, '%')";
        }
        else if( group == "country" ) {
            sql = "select distinct id, bib, type, year, author, title, booktitle, abbr, vol, no, pages, publisher, field, subfield, doi " +
                "from (select name, country from paper.scholar where country = ?) p " +
                "left join paper.list q on q.author like CONCAT('%', p.name, '%')";
        }
        else if( group == "field" ) {
            sql = "select * from paper.list where field = ?";
        }
        else if( group == "subfield" ) {
            sql = "select * from paper.list where subfield = ?"
        }
        else if( group == "booktitle" ) {
            if( content == "phd" ) {
                sql = "select * from paper.list where type = 'phdthesis'" ;
            }
            else if( content == "tech" ) {
                sql = "select * from paper.list where type = 'techreport'" ;
            }
            else {
                sql = "select * from paper.list where abbr = ?" ;
            }
        }
        else {
            console.error("[searchByContent] Error: invalid parameter");
            return;
        }
        sql += " order by year DESC" ;

        // if there is a ? in sql
        if( sql.indexOf('?') != -1 ) {
            var re = content ;
            if( group == "author") {
                re = "%"+content+"%" ;
            }
            connection.query(sql, [re], function(err, results) {
                if (err) {
                    console.error("[searchByContent-1] Error: " + err.message);
                    return;
                }
                connection.release();
                callback(err, results);
            });
        }
        // else
        else {
            connection.query(sql, function(err, results) {
                if (err) {
                    console.error("[searchByContent-2] Error: " + err.message);
                    return;
                }
                connection.release();
                callback(err, results);
            });
        }
    });
};