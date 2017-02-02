var express = require('express');
var Paper = require('../model/Paper');
var Info = require('../model/Info');
var Corner = require('./corner');

var router = express.Router();
let VERSION = '0.1' ;


function authentication(req, res, next) {
  var method = req.method,
      url    = req.originalUrl,
      name   = req.body.name,
      stamp  = req.body.stamp,
      sign   = req.body.sign;

  Corner.signature(method, url, name, stamp, sign, function (state) {
    if(state == 'success')
      next();
    else
      res.json({'state': 'unacceptable actions'});
  });
}

/* Get the information that is shown on homepage */
router.get('/info', authentication, function(req, res) {
  Info.indexInfo(function (err, number, date) {
    res.json({'state': 'done', 'number': number, 'date': date});
  });
});

/* Get the whole paper list */
router.get('/list', authentication, function(req, res) {
  Info.paperAll(function (err, data) {
    res.json({'state': 'done', 'list': data});
  });
});

/* Insert a set of papers into database */
router.post('/update_list', authentication, function (req, res) {
  var paperList = JSON.parse(req.body.paperList);  // convert received json to list
  var paperStamp = req.body.paperStamp;
  var paperDate = req.body.paperDate;

  if ( validatePaper(paperList, paperStamp, paperDate) ) {
    Paper.updatePaper(paperList, paperStamp, paperDate, function (err, s1, s2) {
      if( err )
        res.json({'state': 'error'});
      else {
        Info.timeStamp = paperStamp ;
        res.json({'state': 'success'});
      }
    });
  } else {
    res.json({'state': 'invalid'});
  }
});

/* Insert scholars into database */
router.post('/update_scholar', authentication, function (req, res) {
  var scholarList = JSON.parse(req.body.scholarList);  // convert received json to list

  if ( validateScholar(scholarList) ) {
    Paper.updateScholar(scholarList, function (err, s) {
      if( err )
        res.json({'state': 'error'});
      else
        res.json({'state': 'success'});
    });
  } else {
    res.json({'state': 'invalid'});
  }
});

/* validate paper update request */
function validatePaper(paper, stamp, date) {
  if ( stamp == '' || date == '' )
    return false;

  for( var i=0 , len=paper.length ; i<len ; i++ ) {
    var each = paper[i];
    if (each.year == '' || each.type == '' || each.author == '' || each.title == ''
      || each.field == '' || each.booktitle == '') {
      return false;
    }
  }
  return true;
}

/* validate scholar update request */
function validateScholar(scholar) {
  for( var i=0 , len=scholar.length ; i<len ; i++ ) {
    var each = scholar[i];
    if (each.name == '' || each.institution == '' || each.category == '' || each.country == '') {
      return false;
    }
  }
  return true;
}

module.exports = router;
