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

/* GET search list (search button) */
router.get('/search', function(req, res) {
    var c = req.query.content.trim() ;
    if( c != "" ) {
        res.render('search', {content: c});
    }
    else {
        res.send("bad request");
    }
});

/* GET all list (all button) */
router.get('/all', function(req, res) {
    res.render('all');
})

/* GET author list (author button) */
router.get('/author', function(req, res) {
    Info.getAuthor( function(err, results) {
        if( err ) {
            console.log('SYSTEM ERROR AT AUTHOR');
        }
        else {
            console.log(results);
            res.render('author', {author: results});
        }
    });
});

/* GET research field list (field button) */
router.get('/field', function(req, res) {
    res.render('field');
});

/* GET publication venue list (venue button) */
router.get('/publication', function(req, res) {
    Info.getVenue( function(err, results1, results2) {
        if( err ) {
            console.log('SYSTEM ERROR AT PUBLICATION');
        }
        else {
            res.render('publication', {article: results1, inproceeding: results2});
        }
    });
});

/* GET statistic charts (statistic button) */
router.get('/statistic', function(req, res) {
    Info.getStatistic( function(err, nums, field, top) {
        if( err ) {
            console.log('SYSTEM ERROR AT STATISTIC');
        }
        else {
            console.log(nums);
            console.log(field);
            console.log(top);

            // prepare yearIndex, numA, numC for chart-1
            var yearIndex = [] ;
            var numA = [] ;
            var numC = [] ;
            for( var i=0 ; i<nums.length ; i++ ) {
                yearIndex[i] = "'" + nums[i].year + "'";
                numA[i] = nums[i].num;
                numC[i] = nums[i].count;
            }
            yearIndex = yearIndex.join(',') ;
            numA = numA.join(',') ;
            numC = numC.join(',') ;

            // prepare yearIndex3, app, gen, loc for chart-3
            var yearIndex3 = [] ;
            var app = [] ;
            var gen = [] ;
            var loc = [] ;
            for( var i=0 ; i<top.length ; i++ ) {
                yearIndex3[i] = "'" + top[i].year + "'";
                app[i] = top[i].app == null ? 0 : top[i].app ;
                gen[i] = top[i].gen == null ? 0 : top[i].gen ;
                loc[i] = top[i].loc == null ? 0 : top[i].loc ;
            }
            yearIndex3 = yearIndex3.join(',') ;
            app = app.join(',') ;
            gen = gen.join(',') ;
            loc = loc.join(',') ;

            //console.log(yearIndex);
            //console.log(numA);
            //console.log(numC);

            //console.log(yearIndex3);
            //console.log(app);
            //console.log(gen);
            //console.log(loc);

            res.render('statistic', {
                c1_start : nums[0].year,
                c1_end : nums[nums.length-1].year,
                c1_yearIndex : yearIndex,
                c1_numA : numA,
                c1_numC : numC,
                c2_field: field,
                c3_yearIndex: yearIndex3,
                c3_app: app,
                c3_gen: gen,
                c3_loc: loc
            });
        }
    });
});

/* GET rank list (rank button) */
router.get('/rank', function(req, res) {
    Info.getRank( function(err, results) {
        if( err ) {
            console.log('SYSTEM ERROR AT RANK');
        }
        else {
            res.render('rank', {ranking: results});
        }
    });
});


module.exports = router;
