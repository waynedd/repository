var express = require('express');
var Paper = require('../model/Paper');
var Info = require('../model/Info');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res) {
    Paper.getWholeNum(function (err, result) {
        if( err ) {
            console.log('SYSTEM ERROR AT START');
        }
        else {
            res.render('index', { num: result });
        }
    });
});

/* GET all list (search button) */
router.get('/search', function(req, res) {
    var c = req.query.content.trim() ;
    if( c != "" ) {
        res.render('search', {content: c});
    }
    else {
        res.send("bad request");
    }
});

/* GET publication venue list (venue button) */
router.get('/publication', function(req, res) {
    Info.getVenue( function(err, results1, results2) {
        res.render('publication', {article: results1, inproceeding: results2});
    });
});


module.exports = router;
