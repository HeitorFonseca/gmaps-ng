var express = require('express');
var router = express.Router();
var auth = require('authorized');

var SamplingPoints = require('../models/samplingPoints.js');

/* GET ALL PROPERTIES */
router.get('/:propertyId/:date/:analysisId', function(req, res, next) {
    console.log("get all points",req.params );  

    var query = { PropertyId: req.query.propertyId, Date: req.query.date, AnalysisId: analysisId};

    SamplingPoints.findOne(query, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
  });


  module.exports = router;