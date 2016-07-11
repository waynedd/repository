var express = require('express');
var Paper = require('../model/Paper');
var Info = require('../model/Info');
var router = express.Router();

var VERSION = 1.0 ;

/*
 *  Get all data in the paper.list table
 */
router.get('/all', function(req, res) {
    Paper.getDataAll(function (err, result) {
        res.json({
            'version': VERSION,
            'number':  result.length,
            'list': result
        });
    });
});

module.exports = router;