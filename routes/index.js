var express = require('express');
var Paper = require('../model/Paper');
var Info = require('../model/Info');
var Hooks = require('../model/Hooks');  // hook to minimize html page
var router = express.Router();

/* GET home page */
router.get('/', Hooks.miniHTML, function(req, res) {
    Paper.getWholeNum(function (err, result) {
        if( err ) {
            console.log('SYSTEM ERROR AT START');
            res.render('error', {message: "get start page error"});
        }
        else {
            res.render('index', { num: result });
        }
    });
});

/* GET search list (search button) */
router.get('/search', Hooks.miniHTML, function(req, res) {
    var c = req.query.content.trim() ;
    if(c.length != 0 ) {
        res.render('search', {
            page: "search",
            content: c
        });
    }
    else {
        res.render('error', {message: "please check your behaviour"});
    }
});

/* GET statistic charts (statistic button) */
router.get('/statistic', Hooks.miniHTML, function(req, res) {
    res.render('statistic', {
        page: "statistic"
    });
});

/* GET rank list (rank button) */
router.get('/rank', Hooks.miniHTML, function(req, res) {
    // do the author query
    Info.getRank("author", function(err, results1) {
        if( err ) {
            console.error('SYSTEM ERROR AT RANK');
            res.render('error', {message: "get rank page error"});
        }
        else {
            // do the affiliation query
            Info.getRank("affiliation", function(err, results2) {
                if( err ) {
                    console.error('SYSTEM ERROR AT RANK');
                    res.render('error', {message: "get rank page error"});
                }
                else {
                    res.render('rank', {
                        page: "rank",
                        rankAuthor: results1,
                        rankAffiliation: results2
                    });
                }
            });
        }
    });
});


/* GET all list (all button) */
router.get('/all', Hooks.miniHTML, function(req, res) {
    res.render('all', {
        page: "all"
    });
});

/* GET scholar page with url request parameters (schoalr button) */
router.get('/scholar', Hooks.miniHTML, function(req, res) {
    Info.getScholar(req.query.r, function(err, result) {
        if (err) {
            console.error('SYSTEM ERROR AT SCHOLAR');
            res.render('error', {message: "get scholar page error"});
        }
        else {
            res.render('scholar', {
                page: req.query.r,
                result: result,
                num: result.length
            });
        }
    });
});

/* GET research field list (field button) */
router.get('/field', Hooks.miniHTML, function(req, res) {
    res.render('field', {
        page: "field"
    });
});

/* GET venue list (venue button) */
router.get('/venue', Hooks.miniHTML, function(req, res) {
    Info.getVenue( function(err, results1, results2) {
        if( err ) {
            console.error('SYSTEM ERROR AT PUBLICATION');
            res.render('error', {message: "get booktitle page error"});
        }
        else {
            res.render('venue', {
                page: "venue",
                article: results1,
                inproceeding: results2
            });
        }
    });
});

module.exports = router;
