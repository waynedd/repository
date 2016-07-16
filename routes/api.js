var express = require('express');
var Paper = require('../model/Paper');
var router = express.Router();

var VERSION = 1.0 ;

/*
 *  Get the whole paper.list table
 */
router.get('/all', function(req, res) {
    Paper.getPaperTable(function (err, result) {
        res.json({
            'version' : VERSION,
            'number'  : result.length,
            'result'  : result
        });
    });
});

module.exports = router;