var express = require('express');
var Paper = require('../model/Paper');
var Info = require('../model/Info');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res) {
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
router.get('/search', function(req, res) {
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
router.get('/statistic', function(req, res) {
    Info.getStatistic( function(err, nums, fieldCount, fieldAnnual, firstJoin) {
        if( err ) {
            console.log('SYSTEM ERROR AT STATISTIC');
            res.render('error', {message: "get statistic page error"});
        }
        else {
            // chart 1: number of publication
            // yearIndex, numA, numC
            var yearIndex = [] ;
            var numA = [] ;
            var numC = [] ;
            for( var k=0 ; k<nums.length ; k++ ) {
                yearIndex[k] = "'" + nums[k].year + "'";
                numA[k] = nums[k].num;
                numC[k] = nums[k].count;
            }
            yearIndex = yearIndex.join(',') ;
            numA = numA.join(',') ;
            numC = numC.join(',') ;

            // chart 2: distribution of field

            // chart 3: changing ratio of field
            // generation, application, model, evaluation, optimization, diagnosis, other
            var gen = [], app = [], mod = [], eva = [], opt = [], dig = [], oth = [] ;
            for( var i=0 ; i<fieldAnnual.length ; i++ ) {
                gen[i] = fieldAnnual[i].generation == null ? 0 : fieldAnnual[i].generation ;
                app[i] = fieldAnnual[i].application == null ? 0 : fieldAnnual[i].application ;
                mod[i] = fieldAnnual[i].model == null ? 0 : fieldAnnual[i].model ;
                eva[i] = fieldAnnual[i].evaluation == null ? 0 : fieldAnnual[i].evaluation ;
                opt[i] = fieldAnnual[i].optimization == null ? 0 : fieldAnnual[i].optimization ;
                dig[i] = fieldAnnual[i].diagnosis == null ? 0 : fieldAnnual[i].diagnosis ;
                oth[i] = fieldAnnual[i].other == null ? 0 : fieldAnnual[i].other ;
            }
            gen = gen.join(',') ;
            app = app.join(',') ;
            mod = mod.join(',') ;
            eva = eva.join(',') ;
            opt = opt.join(',') ;
            dig = dig.join(',') ;
            oth = oth.join(',') ;

            // chart 4: people

            // chart 5: number of new affiliation
            // prepare yearIndexFP, numFP, numFPC
            var yearIndexFP = [] ;
            var numFP = [] ;
            var numFPC = [] ;
            for( k=0 ; k<firstJoin.length ; k++ ) {
                yearIndexFP[k] = "'" + firstJoin[k].year + "'";
                numFP[k] = firstJoin[k].num;
                numFPC[k] = firstJoin[k].count;
            }
            yearIndexFP = yearIndexFP.join(',') ;
            numFP = numFP.join(',') ;
            numFPC = numFPC.join(',') ;

            console.log(yearIndexFP);
            console.log(numFP);
            console.log(numFPC);

            res.render('statistic', {
                page: "statistic",
                c1_start : nums[0].year,
                c1_end : nums[nums.length-1].year,
                c1_yearIndex : yearIndex,
                c1_numA : numA,
                c1_numC : numC,
                c2_field: fieldCount,
                c3_generation: gen,
                c3_application: app,
                c3_model: mod,
                c3_evaluation: eva,
                c3_optimization: opt,
                c3_diagnosis: dig,
                c3_other: oth,
                c5_yearIndex : yearIndexFP,
                c5_numA : numFP,
                c5_numC : numFPC
            });
        }
    });
});

/* GET rank list (rank button) */
router.get('/rank', function(req, res) {
    // do the first query
    Info.getRank("author", function(err, results1) {
        if( err ) {
            console.log('SYSTEM ERROR AT RANK');
            res.render('error', {message: "get rank page error"});
        }
        else {
            // do the second query
            Info.getRank("affiliation", function(err, results2) {
                if( err ) {
                    console.log('SYSTEM ERROR AT RANK');
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
router.get('/all', function(req, res) {
    res.render('all', {page: "all"});
});

/* GET author list (author button)
router.get('/author', function(req, res) {
    Info.getAuthor( function(err, results) {
        if( err ) {
            console.log('SYSTEM ERROR AT AUTHOR');
            res.render('error', {message: "get author page error"});
        }
        else {
            res.render('author', {
                page: "author",
                author: results
            });
        }
    });
});*/

/* GET scholar page with url request parameters (schoalr button) */
router.get('/scholar', function(req, res) {
    Info.getScholar(req.query.r, function(err, result) {
        if (err) {
            console.log('SYSTEM ERROR AT SCHOLAR');
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
router.get('/field', function(req, res) {
    res.render('field', {page: "field"});
});

/* GET venue list (venue button) */
router.get('/venue', function(req, res) {
    Info.getVenue( function(err, results1, results2) {
        if( err ) {
            console.log('SYSTEM ERROR AT PUBLICATION');
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
