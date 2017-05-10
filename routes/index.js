var express = require('express');
var DataQuery = require('../model/DataQuery');
var Mini = require('../model/Mini');

var router = express.Router();
var query = new DataQuery();

/*
 *  Home Page
 */
router.get('/', Mini.HTML, function(req, res) {
  query.indexInfo(function (err, num, date) {
    if( err )
      res.render('error', {message: 'System error at start.'});
    else
      res.render('index', {num: num, date: date});
  });
});

/*
 *  Search List (search button)
 */
router.get('/search', Mini.HTML, function(req, res) {
  var c = req.query.content.trim() ;
  if( c.length != 0 )
    res.render('search', {page: 'search', content: c});
  else
    res.render('error', {message: 'Please check your behaviour'});
});

/*
 *  Statistic Chart (statistic button)
 */
router.get('/statistic', Mini.HTML, function(req, res) {
  res.render('statistic', {page: 'statistic'});
});

/*
 *  Rank (rank button)
 */
router.get('/rank', Mini.HTML, function(req, res) {
  // 1. do the author query
  query.ranking('author', function(err, results1) {
    if( err )
      res.render('error', {message: 'System error at rank for author.'});
    else {
      // 2. do the affiliation query
      query.ranking('institution', function(err, results2) {
        if( err )
          res.render('error', {message: 'System error at rank for institution.'});
        else
          res.render('rank', {
            page: 'rank',
            rankAuthor: results1,
            rankAffiliation: results2
          });
      });
    }
  });
});

/*
 *  All Paper List (all button)
 */
router.get('/all', Mini.HTML, function(req, res) {
  res.render('all', {page: 'all'});
});

/*
 *  Scholar Page (scholar button)
 */
router.get('/scholar', Mini.HTML, function(req, res) {
  var r = req.query.r;
  if( r != 'scholar' && r != 'institution' && r != 'country' ) {
    res.render('error', {message: 'System error at scholar: invalid parameter.'});
    return;
  }

  query.scholarAll(r, function(err, result) {
    if (err)
      res.render('error', {message: 'System error at scholar.'});
    else
      res.render('scholar', {
        page: req.query.r,
        result: result,
        num: result.length
      });
  });
});

/*
 *  Research Field (field button)
 */
router.get('/field', Mini.HTML, function(req, res) {
  res.render('field', {page: 'field'});
});

/*
 *  Venue (venue button)
 */
router.get('/venue', Mini.HTML, function(req, res) {
  query.venue( function(err, results1, results2) {
    if( err )
      res.render('error', {message: 'System error at venue.'});
    else
      res.render('venue', {
        page: 'venue',
        article: results1,
        inproceeding: results2
      });
  });
});

module.exports = router;
