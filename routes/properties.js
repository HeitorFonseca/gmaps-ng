var express = require('express');
var router = express.Router();
var auth = require('authorized');

var Property = require('../models/property');
var Area = require('../models/area');
var User = require('../models/user'); // Import User Model Schema
const config = require('../config/database')
const jwt = require('jsonwebtoken');

/* GET all properties */
router.get('/', function (req, res, next) {
  console.log("get all here");
  Property.find({}, function(err, properties) {
    if (err) {
      res.json({success:false, message:"Não foi possivel encontrar as propriedades"});
    }
    console.log(properties);
    res.json(properties);
  });   
});

/* GET single property by id */
router.get('/:id', function (req, res, next) {
  console.log("get property by id");
  console.log(req.params);
  Property.findById(req.params.id, function (err, property) {
    if (err) {
      res.json({success:false, message:"Não foi possivel encontrar a propriedade"});
    }
    console.log(property);
    res.json(property);
  });
});

/* GET property by user id */
router.get('/clientes/:id', function (req, res, next) {
  console.log("get property by user id");
  var query = { usuarioId: req.params.id };
  console.log(query);
  Property.find(query, function (err, properties) {
    if (err) {
      res.json({success:false, message:"Não foi possivel encontrar as propriedades"});
    }
    console.log(properties);
    res.json(properties);
  });
});

/* GET property by tecnician id */
router.get('/tecnicos/:id', function (req, res, next) {
  console.log("get property by technician id");
  var query = { tecnicoId: req.params.id };
  console.log(query);
  Property.find(query, function (err, properties) {
    if (err) {
      res.json({success:false, message:"Não foi possivel encontrar as propriedades"});
    }
    console.log(properties);
    res.json(properties);
  });
});

/* UPDATE Property */
router.put('/:id', function (req, res, next) {

  //console.log("edit by id:", req.params, " ", req.body   );
  console.log("params:", req.params);
  console.log("body:", req.body);

  var query = { _id: req.params.id };
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
router.delete('/:id', function (req, res, next) {
  console.log("delete property by id:", req.params);

  Property.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) {
      console.log(err);
      return next(err);
    }

    post.remove();

    console.log("deleted");
    res.json({success: true, message:"Propriedade deletada"});
  });
});

/* REGISTER Property */
router.post('/register', requireProductor, function (req, res, next) {
  console.log("register property", req.body);
  Property.create(req.body, function (err, post) {

    if (err) {
      // Check if error is an error indicating duplicate account
      if (err.code === 11000) {
        res.json({ success: false, message: 'Property name already exists' }); // Return error
      } else {
        res.json({ success: false, message: 'Could not save Property. Error: ', err }); // Return error if not related to validation
      }
    } else {
      res.json({ success: true, message: 'Property registered!', propriedade: { id: post._id, nome: post.nome } }); // Return success
    }
  });
});

/*______________________________________________Areas____________________________________________________*/

/* GET areas by property id */
router.get('/:propriedadeId/areas', function (req, res, next) {
  console.log("get areas by property id");
  console.log(req.query);
  var query = { propriedadeId: req.query.propriedadeId };
  Area.find(query, function (err, areas) {
    if (err) {
      res.json(err);
    }
    console.log(areas);
    res.json(areas);
  });
});

/* REGISTER Area */
router.post('/:propriedadeId/areas', requireProductorAndHectare, function (req, res, next) {
  console.log(req.body);

  Area.create(req.body, function (err, post) {

    if (err) {
      res.json({ success: false, message: 'Não foi possivel salvar a area. Error: ', err }); // Return error if not related to validation              
    } else {
      res.json({ success: true, message: 'Area registrada!' }); // Return success
    }
  });
});

/* UPDATE Areas */
router.put('/areas/:id', function (req, res, next) {
  console.log("update area by id:", req.body);

  var query = { _id: req.params.id };
  console.log("query:", query);

  Area.findByIdAndUpdate(query, req.body, function (err, post) {
    if (err) {
      res.json({ success: false, message: 'Não foi possivel salvar a area.'}); // Return error if not related to validation              
    } else {
      res.json({ success: true, message: 'Area registrada!' }); // Return success
    }
  });
});

/* DELETE Property */
router.delete('/areas/:id', function (req, res, next) {
  console.log("delete area by id:", req.params);

  Area.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.json(post);
  });
});


/*______________________________________________Auxiliar function____________________________________________________*/


function requireProductor(req, res, next) {

  var token = req.headers['x-access-token'];

  if (!token) return res.status(401).send({ success: false, message: 'Nenhum token fornecido.' });
  console.log("get user", token);

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      console.log(err);
      console.log("falha na autenticacao");
      return res.status(500).send({ success: false, message: 'Falha na autenticação do token.' });
    }

    User.findById(decoded.userId, { senha: 0 }, function (err, user) {
      if (err) return res.status(500).send({ success: false, message: "Encontramos problema ao encontrar o usuário." });
      if (!user) return res.status(404).send({ success: false, message: "Nenhum usuário encontrado." });

      console.log("role:", user.tipo);
      if (user.tipo != 'produtor') {
        res.json({  success: false, message: 'Permission denied.' });
      } else {
        next();
      }
    });
  });
};

function requireProductorAndHectare(req, res, next) {

  var token = req.headers['x-access-token'];
  console.log(req);

  if (!token) return res.status(401).send({ success: false, message: 'Nenhum token fornecido.' });
  console.log("get user", token);

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Falha na autenticação do token.' });
    }

    User.findById(decoded.userId, { senha: 0 }, function (err, user) {
      if (err) return res.status(500).send({ success: false, message: "Encontramos problema ao encontrar o usuário." });
      if (!user) return res.status(404).send({ success: false, message: "Nenhum usuário encontrado." });

      console.log("role:", user);
      if (user.tipo != 'produtor') {
        res.json({ success: false, message: 'Voce não tem permissão para esta ação' });
      }
      else if (user.hectaresRestantes < req.body.areaTotal) {
        res.json({ success: false, message: 'Hectares insuficientes' })
      }
      else {
        next();
      }
    });
  })
};

module.exports = router;