/**
 *  the APIs to respond query request
 */
var express = require('express');
var Paper = require('../model/Paper');
var Info = require('../model/Info');
var router = express.Router();

/*
 *  return search list
 */
router.post('/search', function(req, res) {
    var content = req.body.content;
    //console.log(content);
    Paper.searchByInput(content, function (err, results) {
        res.send(JSON.stringify(results));
    });
});

/*
 *  return all list
 */
router.post('/all', function(req, res) {
    Paper.getPaperAll(function (err, results) {
        res.send(JSON.stringify(results));
    });
});

/*
 *  return query list
 *  group = author | affiliation | country | field | subfield | booktitle
 *  content = the name to be searched
 */
router.post('/query', function(req, res) {
    var group = req.body.group ;
    var content = req.body.content ;

    Paper.searchByContent(group, content, function (err, results) {
        res.send(JSON.stringify(results));
    });
});

/*
 *  return information for a particular author
 */
router.post('/author_info', function(req, res) {
    var content = req.body.content ;
    Info.getAuthorInfo(content, function (err, result1, result2) {
        res.send({
            basicInfo: JSON.stringify(result1),
            focusField: JSON.stringify(result2)
        });
    });
});

/*
 *  return statistic data for plotting charts
 */
router.post('/chart', function (req, res) {
    var no = req.body.no ;

    // chart 1: number of publication
    if( no == "1" ) {
        Info.getStatistics(1, function (err, results) {
            var yearIndex = [] ;
            var numA = [] ;
            var numC = [] ;
            for( var k=0 ; k<results.length ; k++ ) {
                yearIndex[k] = results[k].year;
                numA[k] = results[k].num;
                numC[k] = results[k].count;
            }
            var data = new Object();
            data.yearIndex = yearIndex ;
            data.annual = numA ;
            data.cumulative = numC ;
            res.send(JSON.stringify(data));
        });
    }

    // chart 2: distribution of field
    else if( no == "2" ) {
        Info.getStatistics(2, function (err, results) {
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
    else if( no == "3" ) {
        Info.getStatistics(3, function (err, results) {
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

    // chart 5: number of new affiliation
    else if( no == "5" ) {
        Info.getStatistics(5, function (err, results) {
            var yearIndex = [] ;
            var numA = [] ;
            var numC = [] ;
            for( var k=0 ; k<results.length ; k++ ) {
                yearIndex[k] = "'" + results[k].year + "'";
                numA[k] = results[k].num ;
                numC[k] = results[k].count ;
            }
            var data = new Object();
            data.yearIndex = yearIndex ;
            data.annual = numA ;
            data.cumulative = numC ;
            res.send(JSON.stringify(data));
        });
    }

    else {
        res.send("Error");
    }
});

module.exports = router;
