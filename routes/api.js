var express = require('express');
var DataUpdate = require('../model/DataUpdate');
var DataQuery = require('../model/DataQuery');
var Corner = require('./corner');

var router = express.Router();
var query  = new DataQuery();
var update = new DataUpdate();

function authentication(req, res, next) {
  var method = req.method,
      url    = req.originalUrl,
      name   = req.body.authName,
      stamp  = req.body.authStamp,
      sign   = req.body.authSign;

  Corner.signature(method, url, name, stamp, sign, function (state) {
    if (state == 'success') next();
    else res.json({'state': 'unacceptable actions'});
  });
}

/*
 *  Return the information that is shown on homepage.
 *  Responses: number, date
 */
router.get('/info', authentication, function(req, res) {
  query.indexInfo(function (err, number, date) {
    res.json({'number': number, 'date': date});
  });
});

/*
 *  Return the whole paper list.
 *  Responses: list
 */
router.get('/paper', authentication, function(req, res) {
  query.paperAll(function (err, data) {
    res.json({'list': data});
  });
});

/*
 *  Return the names that are not included in current scholar table.
 *  Responses: list
 */
router.get('/scholar', authentication, function(req, res) {
  query.scholarAll('scholar', function (err, data) {
    res.json({'list': data});
  });
});


/*
 *  Insert a set of papers into database.
 *  Parameters: list, stamp, date
 *  Responses: state
 */
router.post('/paper', authentication, function (req, res) {
  var paper = JSON.parse(req.body.list); // convert received json to list
  var stamp = req.body.stamp;
  var date = req.body.date;

  if ( validatePaper(paper, stamp, date) ) {
    update.paperTable(paper, stamp, date, function (err, s1, s2) {
      if( err )
        res.json({'state': 'error'});
      else {
        global.timeStamp = stamp ;
        res.json({'state': 'success'});
      }
    });
  } else {
    res.json({'state': 'invalid'});
  }
});

/*
 *  Insert a set of scholars into database.
 *  Parameters: list
 *  Responses: state
 */
router.post('/scholar', authentication, function (req, res) {
  var scholar = JSON.parse(req.body.list);  // convert received json to list

  if ( validateScholar(scholar) ) {
    update.scholarTable(scholar, function (err, s) {
      if( err )
        res.json({'state': 'error'});
      else
        res.json({'state': 'success'});
    });
  } else {
    res.json({'state': 'invalid'});
  }
});

/*
 *  Simple validation before updating paper.
 */
function validatePaper(paper, stamp, date) {
  if ( stamp == '' || date == '' )
    return false;

  for( var i=0 , len=paper.length ; i<len ; i++ ) {
    var each = paper[i];
    if (each.year == '' || each.type == '' || each.author == '' ||
        each.title == '' || each.field == '' || each.booktitle == '') {
      return false;
    }
  }
  return true;
}

/*
 *  Simple validation before updating scholar.
 */
function validateScholar(scholar) {
  for( var i=0 , len=scholar.length ; i<len ; i++ ) {
    var each = scholar[i];
    if (each.name == '' || each.institution == '' || each.category == '' ||
        each.country == '') {
      return false;
    }
  }
  return true;
}

module.exports = router;
