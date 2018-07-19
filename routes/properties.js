var express = require('express');
var router = express.Router();
var auth = require('authorized');

var Property = require('../models/property');
var User = require('../models/user'); // Import User Model Schema

/* GET ALL PROPERTIES */
router.get('/', function(req, res, next) {
  console.log("get all here");  
  Property.find({})
    .then(result => res.json(result))
    .catch(err => console.log(err))
});

/* GET SINGLE PROPERTY BY NAME */
router.get('/:userId', function(req, res, next) { 
  console.log("get property by id");
  var query = { OwnerId: req.query.userId };
  console.log(query);
  Property.find(query, function(err, properties) {
      if (err) {
          res.json(err);
      }
      console.log(properties);
      res.json(properties);
  });
}); 

/* Get single property by name */
router.get('/:userId/:name', function(req, res, next) { 
  console.log("get property by name");
  var query = { OwnerId: req.query.userId, PropertyName: req.query.name };
  console.log(query);
  Property.find(query, function(err, properties) {
      if (err) {
          res.json(err);
      }
      console.log(properties);
      res.json(properties);
  });
}); 

/* Update Property */
router.put('/:id', function(req, res, next) {

  //console.log("edit by id:", req.params, " ", req.body   );

  var query = { _id: req.body._id };
  console.log("query:", query);

  Property.findOneAndUpdate(query, req.body, function (err, post) {
    if (err) {         
      res.json({ success: false, message: 'Could not update property. Error: ', err }); // Return error if not related to validation              
    } else {
      res.json({ success: true, message: 'Property updated!' }); // Return success
    }    
  });
});

/* DELETE Property */
router.delete('/:name', function(req, res, next) {
  console.log("delete by name:", req.params );

  var query = { PropertyName: req.query.name };
  Property.findOneAndRemove(query, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE Property */
router.post('/register', requireAdmin, function(req, res, next) {
  console.log(req.body);
  Property.create(req.body, function (err, post) {
        
    if (err) {
      // Check if error is an error indicating duplicate account
      if (err.code === 11000) {
        res.json({ success: false, message: 'Property name already exists' }); // Return error
      } else {
          res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
        }      
    } else {
      res.json({ success: true, message: 'Property registered!' }); // Return success
    }       
  });
});

/*______________________________________________Analysis____________________________________________________*/

// /* Get analysis by property */

// router.get("/:name", function(req, res, next) { 
//   console.log("get property by name");
//   var query = { PropertyName: req.query.name };
//   console.log(query);
//   Property.findOne(query, function(err, properties) {
//       if (err) {
//           res.json(err);
//       }

//       console.log(properties);
//       res.json(properties);
//   });
// }); 


function requireAdmin(request, response, next) {

  User.findById({_id: request.body.OwnerId}, (err, user) => {
    if (err) {
      console.log("err");

      response.json({ success: false, message: err});
    } else {
      if (!user) {
        console.log("username not found:");

        response.json( { success: false, message: 'Username not found'});
      } else {
        console.log("role:",user.roles);
        if (user.roles[0] != 'ADMIN') {
          response.json({message: 'Permission denied.' });
        } else {        
          next();
        }
      }      
    }
  });
};

module.exports = router;