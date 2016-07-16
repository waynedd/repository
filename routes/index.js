var express = require('express');
var Info = require('../model/Info');
var Hooks = require('../model/Hooks');  // hook to minimize html page
var router = express.Router();

/* GET home page */
router.get('/', Hooks.miniHTML, function(req, res) {
    Info.getIndexInfo(function (err, num, date) {
        if( err )
            res.render('error', {message: 'System error at start.'});
        else
            res.render('index', {num: num, date: date});
    });
});

/* GET search list (search button) */
router.get('/search', Hooks.miniHTML, function(req, res) {
    var c = req.query.content.trim() ;
    if( c.length != 0 ) {
        res.render('search', { page: 'search', content: c });
    }
    else {
        res.render('error', {message: 'Please check your behaviour'});
    }
});

/* GET statistic charts (statistic button) */
router.get('/statistic', Hooks.miniHTML, function(req, res) {
    res.render('statistic', { page: 'statistic' });
});

/* GET rank list (rank button) */
router.get('/rank', Hooks.miniHTML, function(req, res) {
    // 1. do the author query
    Info.getRank('author', function(err, results1) {
        if( err ) {
            res.render('error', {message: 'System error at rank for author.'});
        }
        else {
            // 2. do the affiliation query
            Info.getRank('institution', function(err, results2) {
                if( err ) {
                    res.render('error', {message: 'System error at rank for institution.'});
                }
                else {
                    res.render('rank', {
                        page: 'rank',
                        rankAuthor: results1,
                        rankAffiliation: results2 });
                }
            });
        }
    });
});


/* GET all list (all button) */
router.get('/all', Hooks.miniHTML, function(req, res) {
    res.render('all', { page: 'all'});
});

/* GET scholar page with url request parameters (scholar button) */
router.get('/scholar', Hooks.miniHTML, function(req, res) {
    var r = req.query.r;
    if( r != 'scholar' && r != 'institution' && r != 'country' ) {
        res.render('error', {message: 'System error at scholar: invalid parameter.'});
        return ;
    }

    Info.getScholar(r, function(err, result) {
        if (err) {
            res.render('error', {message: 'System error at scholar.'});
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
    res.render('field', { page: 'field' });
});

/* GET venue list (venue button) */
router.get('/venue', Hooks.miniHTML, function(req, res) {
    Info.getVenue( function(err, results1, results2) {
        if( err ) {
            res.render('error', {message: 'System error at venue.'});
        }
        else {
            res.render('venue', {
                page: 'venue',
                article: results1,
                inproceeding: results2
            });
        }
    });
});

module.exports = router;
