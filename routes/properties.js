var express = require('express');
var router = express.Router();
var Property = require('../models/Property.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});

/* GET ALL PROPERTIES */
router.get('/add', function(req, res, next) {
  console.log("here");
  Property.find({})
    .then(result => res.json(result))
    .catch(err => console.log(err))
});

/* GET SINGLE PROPERTY BY ID */
router.get('/:id', function(req, res, next) {
  Property.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE Property */
router.post('/', function(req, res, next) {
  Property.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Property */
router.put('/:id', function(req, res, next) {
  Property.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Property */
router.delete('/:id', function(req, res, next) {
  Property.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;