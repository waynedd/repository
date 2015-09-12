var express = require('express');
var Paper = require('../model/Paper');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res, next) {
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
        res.render('search', { content: c});
    }
    else {
        res.send("bad request");
    }
});

module.exports = router;
