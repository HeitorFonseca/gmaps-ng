var express = require('express');
var router = express.Router();
var auth = require('authorized');
const mongoose = require('mongoose'); // Node Tool for MongoDB

var Property = require('../models/property');
var Area = require('../models/area');
var User = require('../models/user'); // Import User Model Schema
const config = require('../config/database')
const jwt = require('jsonwebtoken');

var permissions = require('./permissions');

/* GET all properties */
router.get('/', permissions.requireToken, function (req, res, next) {
  console.log("get all here");

  var token = req.headers['x-access-token'];

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(500).send({ success: false, message: 'Falha na autenticação do token.' });
    }

    var query = {};

    if (decoded.type == "produtor") {
      query = { usuarioId: mongoose.Types.ObjectId(decoded.userId) };
    }
    else if (decoded.type == "tecnico") {
      query = { tecnicoId: mongoose.Types.ObjectId(decoded.userId) };
    }
    else if (decoded.type == "administrador") {
      query = {};
    }
    else {
      return res.status(401).send({ message: "Operação não permitida!." });
    }

    console.log("query", query);

    Property.find(query, function (err, properties) {
      if (err) {
        res.status(500).json({ message: "Não foi possivel encontrar as propriedades." });
      } else {
        properties = properties.map(element => {
          return { id: element._id, nome: element.nome, areaTotal: element.areaTotal };
        });

        res.status(200).json(properties);
      }
    });

  });
});

// /* GET all properties */
// router.get('/', permissions.requireToken, function (req, res, next) {
//   console.log("get all here");

//   var token = req.headers['x-access-token'];

//   jwt.verify(token, config.secret, function (err, decoded) {
//     if (err) {
//       console.log(err);
//       console.log("falha na autenticacao");
//       return res.status(500).send({ success: false, message: 'Falha na autenticação do token.' });
//     }

//     console.log("usr id", decoded.userId);
//     console.log("tipo é:", decoded.type);
//     var query = {};

//     if (decoded.type == "produtor") {
//       query = { usuarioId: mongoose.Types.ObjectId(decoded.userId) };
//     }
//     else if (decoded.type == "tecnico") {
//       query = { tecnicoId: mongoose.Types.ObjectId(decoded.userId) };
//     }
//     else if (decoded.type == "administrador") {
//       query = {};
//     }
//     else {
//       return res.status(500).send({ success: false, message: "Operação não permitida!" });
//     }
//     console.log("query", query);
//     Property.aggregate([
//       { $match: query },
//       {
//         $lookup: {
//           localField: "usuarioId",
//           from: "users",
//           foreignField: "_id",
//           as: "usuario"
//         }
//       },
//       { $unwind: "$usuario" },
//       { $addFields: { id: "$_id" } },
//       { $addFields: { cliente: { id: '$usuario._id', nome: '$usuario.nome' } } },
//       {
//         $project: { _id: 0, usuarioId: 0, tecnicoId: 0, usuario: 0 }
//       }
//     ], function (err, properties) {
//       if (err) {
//         console.log("error", err);
//         res.json({ success: false, message: 'Não foi possivel retornar as propriedades. Erro: ', err });
//       }
//       else {
//         console.log("propriedades:", properties);
//         res.status(200).json(properties);
//       }
//     });
//   });
// });

router.get('/:id', function (req, res, next) {
  console.log("get property by id");
  console.log(req.params);

  Property.findById(req.params.id, function (err, property) {

    if (err) {
      res.status(500).json({ message: "Não foi possivel encontrar aa propriedade." });
    }
    if (!property) {
      res.status(404).json({ message: "Propriedade não encontrada." });
    }
    else {
      res.status(200).json({ id: property._id, nome: property.nome, areaTotal: property.areaTotal });
    }

  });
});

// /* GET single property by id */
// router.get('/:id', function (req, res, next) {
//   console.log("get property by id");
//   console.log(req.params);

//   var query = { _id: mongoose.Types.ObjectId(req.params.id) };

//   Property.aggregate([
//     { $match: query },
//     {
//       $lookup: {
//         localField: "usuarioId",
//         from: "users",
//         foreignField: "_id",
//         as: "usuario"
//       }
//     },
//     { $unwind: "$usuario" },
//     { $addFields: { id: "$_id" } },
//     { $addFields: { cliente: { id: '$usuario._id', nome: '$usuario.nome' } } },
//     {
//       $project: { _id: 0, usuarioId: 0, tecnicoId: 0, usuario: 0 }
//     }
//   ], function (err, property) {
//     if (err) {
//       console.log("error", err);
//       res.json({ success: false, message: 'Não foi possivel retornar as propriedades. Erro: ', err });
//     }
//     else {
//       console.log("propriedade:", property);
//       res.json(property[0]);
//     }
//   });
// });

/* UPDATE Property */
router.put('/:id', function (req, res, next) {
  var query = { _id: req.params.id };
  console.log("query:", query);

  Property.findOneAndUpdate(query, req.body, function (err, property) {
    if (err) {
      res.status(500).json({ message: 'Não foi possivel editar a propriedade. Error: ', err }); // Return error if not related to validation              
    } else {
      res.status(201).json({ message: 'Propriedade editada!', id: property._id, nome: req.body.nome }); // Return success
    }
  });
});

/* DELETE Property */
router.delete('/:id', function (req, res, next) {
  console.log("delete property by id:", req.params);

  Property.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Não foi possivel remover a propriedade!" });
    } else {

      post.remove();

      console.log("deleted");
      res.status(204).json({ message: "Propriedade deletada!." });
    }
  });
});

/* REGISTER Property */
router.post('/register', permissions.requireProductor, function (req, res, next) {
  console.log("register property", req.body);
  Property.create(req.body, function (err, post) {

    if (err) {
      // Check if error is an error indicating duplicate account
      if (err.code === 11000) {
        res.status(400).json({ message: 'Este nome da propriedade já existe!.' }); // Return error
      } else {
        res.status(500).json({ message: 'Não foi possivel salvar a propriedade.' }); // Return error if not related to validation
      }
    } else {
      res.status(200).json({ message: 'Propriedade registrada!', id: post._id, nome: post.nome }); // Return success
    }
  });
});

/*______________________________________________Areas____________________________________________________*/

/* GET areas by property id */
router.get('/:propriedadeId/areas', function (req, res, next) {
  console.log("get areas by property id");
  console.log(req.params);
  var query = { propriedadeId: req.params.propriedadeId };
  Area.find(query, function (err, areas) {
    if (err) {
      res.status(500).json({message: "Nâo foi possivel encontrar as areas"});
    } else  {
      
      areas = areas.map(element => {
        return {id: element._id, propriedadeId: element.propriedadeId, nome: element.nome, areaTotal: element.areaTotal, plantio: element.plantio, area: element.area};
      });

      res.status(200).json(areas);
    }  
  });
});

/* REGISTER Area */
router.post('/:propriedadeId/areas', permissions.requireProductorAndHectare, function (req, res, next) {
  console.log("BODY:", req.body);

  Area.create(req.body, function (err, post) {

    if (err) {

      res.status(500).json({ message: 'Não foi possivel salvar a area. Error: ', err }); // Return error if not related to validation              
    } else {
      res.status(200).json({ message: 'Area registrada!' }); // Return success
    }
  });
});

/* GET areas by id */
router.get('/areas/:id', function (req, res, next) {
  console.log("get areas by property id");
  console.log(req.params);
  
  Area.findById(req.params.id, function (err, areas) {
    if (err) {
      res.status(500).json({message: "Nâo foi possivel encontrar a area"});
    } else  {

      res.status(200).json({id: element._id, propriedadeId: element.propriedadeId, nome: element.nome, areaTotal: element.areaTotal, plantio: element.plantio, area: element.area});
    }  
  });
});

/* UPDATE Area by id */
router.put('/areas/:id', function (req, res, next) {
  console.log("update area by id:", req.body);

  var query = { _id: req.params.id };
  console.log("query:", query);

  Area.findByIdAndUpdate(query, req.body, function (err, area) {
    if (err) {
      res.status(500).json({ message: 'Não foi possivel salvar a area.' }); // Return error if not related to validation              
    } else {
      res.status(200).json({ message: 'Area editada!', id: area._id, nome: area.nome, areaTotal: area.areaTotal, plantio: area.plantio, area: area.area }); // Return success
    }
  });
});

/* DELETE Property */
router.delete('/areas/:id', function (req, res, next) {
  console.log("delete area by id:", req.params);

  Area.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) {
      console.log(err);
      res.status(500).json({message: "Não foi possivel deletar a area"});
    }
    res.status(204).json({message: "Area deletada!."});
  });
});


/*______________________________________________Auxiliar function____________________________________________________*/


module.exports = router;