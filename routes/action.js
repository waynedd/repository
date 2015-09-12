var express = require('express');
var Paper = require('../model/Paper');
var router = express.Router();

/* POST all list. */
router.post('/all', function(req, res) {
    var content = req.body.content;
    console.log(content);

    Paper.searchByInput(content, function (err, results) {
        console.log(JSON.stringify(results));
        res.send(JSON.stringify(results));
    });
});

module.exports = router;
