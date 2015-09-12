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
 *  get the list of publication venues
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
