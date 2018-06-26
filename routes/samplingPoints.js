var express = require('express');
var router = express.Router();
var auth = require('authorized');

var SamplingPoints = require('../models/samplingPoints');

/* GET ALL PROPERTIES */
router.get('/:propertyId/:date/:analysisId', function(req, res, next) {
    console.log("get all points", req.params );  
    console.log("get all points", req.query );  

    var query = { PropertyId: req.query.propertyId, Date: req.query.date};
    console.log("query:", query);
    SamplingPoints.findOne(query, function (err, post) {
        if (err) return next(err);
        console.log(post);
        res.json(post);
      });


  });


  module.exports = router;