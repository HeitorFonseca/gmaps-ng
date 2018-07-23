var express = require('express');
var router = express.Router();
var auth = require('authorized');

var Property = require('../models/property');
var Area = require('../models/area');
var User = require('../models/user'); // Import User Model Schema

/* GET all properties */
router.get('/', function(req, res, next) {
  console.log("get all here");  
  Property.find({})
    .then(result => res.json(result))
    .catch(err => console.log(err))
});

/* GET property by user id */
router.get('/user', function(req, res, next) { 
  console.log("get property by user id");
  var query = {usuarioId: req.query.id };
  console.log(query);
  Property.find(query, function(err, properties) {
      if (err) {
          res.json(err);
      }
      console.log(properties);
      res.json(properties);
  });
}); 

/* GET single property by id */
router.get('/:id', function(req, res, next) { 
  console.log("get property by id");
  console.log(req.query);
  Property.findById(req.query.id, function(err, property) {
      if (err) {
          res.json(err);
      }
      console.log(property);
      res.json(property);
  });
}); 

/* UPDATE Property */
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

/* REGISTER Property */
router.post('/register', requireAdmin, function(req, res, next) {
  console.log(req.body);
  Property.create(req.body, function (err, post) {
        
    if (err) {
      // Check if error is an error indicating duplicate account
      if (err.code === 11000) {
        res.json({ success: false, message: 'Property name already exists' }); // Return error
      } else {
          res.json({ success: false, message: 'Could not save Property. Error: ', err }); // Return error if not related to validation
        }      
    } else {
      res.json({ success: true, message: 'Property registered!', propriedade: {id: post._id, nome: post.nome} }); // Return success
    }       
  });
});

/*______________________________________________Areas____________________________________________________*/

/* GET areas by property id */
router.get('/:propriedadeId/areas', function(req, res, next) { 
  console.log("get areas by property id");
  console.log(req.query);
  var query = { propriedadeId: req.query.propriedadeId };
  Area.find(query, function(err, areas) {
      if (err) {
          res.json(err);
      }
      console.log(areas);
      res.json(areas);
  });
}); 

/* REGISTER Area */
router.post('/:propriedadeId/areas', function(req, res, next) {
  console.log(req.body);  

  Area.create(req.body, function (err, post) {
        
    if (err) {      
      res.json({ success: false, message: 'Não foi possivel salvar a area. Error: ', err }); // Return error if not related to validation              
    } else {
      res.json({ success: true, message: 'Area registrada!' }); // Return success
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

  User.findById({_id: request.body.usuarioId}, (err, user) => {
    if (err) {
      console.log("err");

      response.json({ success: false, message: err});
    } else {
      if (!user) {
        console.log("username not found:");

        response.json( { success: false, message: 'Username not found'});
      } else {
        console.log("role:",user.tipo);
        if (user.tipo != 'produtor') {
          response.json({message: 'Permission denied.' });
        } else {        
          next();
        }
      }      
    }
  });
};

module.exports = router;