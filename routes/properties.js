var express = require('express');
var router = express.Router();
var Property = require('../models/property.js');

/* GET ALL PROPERTIES */
router.get('/', function(req, res, next) {
  console.log("get all here");  
  Property.find({})
    .then(result => res.json(result))
    .catch(err => console.log(err))
});

/* GET SINGLE PROPERTY BY NAME */
router.get('/:name', function(req, res, next) { 
  console.log("get property by name");
  var query = { PropertyName: req.query.name };
  console.log(query);
  Property.find(query, function(err, properties) {
      if (err) {
          res.json(err);
      }
      console.log(properties);
      res.json(properties);
  });
}); 

/* SAVE Property */
router.post('/register', function(req, res, next) {
  console.log(req.body);
  Property.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Property */
router.put('/:name', function(req, res, next) {
  // Property.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
  console.log("edit by name:", req.params, " ", req.body   );

  var query = { PropertyName: req.body.PropertyName };
  Property.findOneAndUpdate(query, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Property */
router.delete('/:name', function(req, res, next) {
  console.log("delete by name:", req.params );
  // Property.findByIdAndRemove(req.params.id, req.body, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
  var query = { PropertyName: req.query.name };
  Property.findOneAndRemove(query, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;