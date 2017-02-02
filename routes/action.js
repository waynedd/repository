/**
 *  The methods used to deal with query request.
 */
var express = require('express');
var Info = require('../model/Info');

var router = express.Router();

/**
 *  Parameters:
 *    start    - the start index
 *    step     - the number of items in each page, default = 25
 *    group    - type of search [all | search | scholar | institution | country | field | tag | booktitle]
 *    content  - particular name or text
 *  Return:
 *    totalNum - the number of all matches
 *    result   - the publication list of all matches
 */

function verify(req, res, next) {
  let valid = ['all', 'search', 'scholar', 'institution', 'country', 'field', 'tag', 'booktitle'];
  if( valid.indexOf(req.body.group) < 0 || req.body.start < 0 || req.body.step < 0 )
    res.send("invalid request");
  else
    next();
}

/* search list  */
router.post('/search', verify, function(req, res) {
  var content = req.body.content;
  var start = req.body.start ;
  var step = req.body.step ;

  Info.searchInput(content, start, step, function (err, totalNum, result) {
    res.send({
      totalNum: totalNum,
      result: JSON.stringify(result),
      timeStamp: Info.timeStamp
    });
  });
});

/*  all list  */
router.post('/all', verify, function(req, res) {
  var start = req.body.start ;
  var step = req.body.step ;

  Info.paperList(start, step, function (err, totalNum, result) {
    res.send({
      totalNum: totalNum,
      result: JSON.stringify(result),
      timeStamp: Info.timeStamp
    });
  });
});

/*
 *  particular list
 *    group = scholar | institution | country | field | tag | booktitle
 *    content = the name to be searched
 */
router.post('/query', verify, function(req, res) {
  var group = req.body.group ;
  var content = req.body.content ;
  var start = req.body.start ;
  var step = req.body.step ;

  Info.searchContent(group, content, start, step, function (err, totalNum, result) {
    res.send({
      totalNum: totalNum,
      result: JSON.stringify(result),
      timeStamp: Info.timeStamp
    });
  });
});

/*  scholar information  */
router.post('/scholar_info', verify, function(req, res) {
  var content = req.body.content ;
  Info.scholarInfo(content, function (err, result1, result2) {
    res.send({
      basicInfo: JSON.stringify(result1),
      focusField: JSON.stringify(result2)
    });
  });
});

/*  statistic data for plotting charts  */
router.post('/chart', function (req, res) {
  var no = req.body.no ;

  // chart 1: number of publication
  if( no == '1' ) {
    Info.statistics(1, function (err, results) {
      if( err ) {
        res.send({error: 'Get data error.'});
        return;
      }

      var yearIndex = [] ;
      var numA = [] ;
      var numC = [] ;
      for( var k=0 ; k<results.length ; k++ ) {
        yearIndex[k] = results[k].year;
        numA[k] = results[k].num;
        numC[k] = results[k].count;
      }
      var data = new Object();
      data.yearIndex = yearIndex;
      data.annual = numA;
      data.cumulative = numC;
      res.send(JSON.stringify(data));
    });
  }

  // chart 2: distribution of field
  else if( no == '2' ) {
    Info.statistics(2, function (err, results) {
      if( err ) {
        res.send({error: 'Get data error.'});
        return;
      }

      var category = [];
      for( var k=0 ; k<results.length ; k++ ) {
        var tp = [] ;
        tp[0] = results[k].field ;
        tp[1] = results[k].count ;
        category[k] = tp ;
      }
      var data = new Object();
      data.category = category ;
      res.send(JSON.stringify(data));
    });
  }

  // chart 3: changing ratio of field
  else if( no == '3' ) {
    Info.statistics(3, function (err, results) {
      if( err ) {
        res.send({error: 'Get data error.'});
        return;
      }

      // year, num, generation, application, model, evaluation, optimization, diagnosis, other
      var yearIndex = [], gen = [], app = [], mod = [], eva = [], opt = [], dig = [], oth = [] ;
      for( var i=0 ; i<results.length ; i++ ) {
        yearIndex[i] = results[i].year;
        gen[i] = results[i].generation == null ? 0 : results[i].generation ;
        app[i] = results[i].application == null ? 0 : results[i].application ;
        mod[i] = results[i].model == null ? 0 : results[i].model ;
        eva[i] = results[i].evaluation == null ? 0 : results[i].evaluation ;
        opt[i] = results[i].optimization == null ? 0 : results[i].optimization ;
        dig[i] = results[i].diagnosis == null ? 0 : results[i].diagnosis ;
        oth[i] = results[i].other == null ? 0 : results[i].other ;
      }
      var data = new Object();
      data.yearIndex = yearIndex ;
      data.generation = gen ;
      data.application = app ;
      data.model = mod ;
      data.evaluation = eva ;
      data.optimization = opt ;
      data.diagnosis = dig ;
      data.other = oth ;
      res.send(JSON.stringify(data));
    });
  }

  // chart 4: distribution of scholars
  else if( no =='4' ) {
    Info.statistics(4, function (err, results) {
      if( err ) {
        res.send({error: 'Get data error.'});
        return;
      }

      // add each country
      var data = [];
      for( var k=0 ; k<results.length ; k++ ) {
        var each = new Object();
        each.value = results[k].count;
        each.code = results[k].code;
        data.push(each);
      }
      res.send(JSON.stringify(data));
    });
  }

  // chart 5: number of new affiliation
  else if( no == '5' ) {
    Info.statistics(5, function (err, results) {
      if( err ) {
        res.send({error: 'Get data error.'});
        return;
      }

      var yearIndex = [] ;
      var numA = [] ;
      for( var k=0 ; k<results.length ; k++ ) {
        yearIndex[k] = results[k].year ;
        numA[k] = results[k].num ;
      }
      var data = new Object();
      data.yearIndex = yearIndex ;
      data.annual = numA ;
      res.send(JSON.stringify(data));
    });
  }

  else {
    res.send('Error');
  }
});

module.exports = router;
