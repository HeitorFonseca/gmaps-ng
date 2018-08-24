var express = require('express');
var router = express.Router();
var auth = require('authorized');
const mongoose = require('mongoose'); // Node Tool for MongoDB
const config = require('../config/database');
const jwt = require('jsonwebtoken');

// handle file upload
var multer = require('multer');
var upload = multer({ dest: './files/imgReports' });

var Property = require('../models/property');
var Area = require('../models/area');
var User = require('../models/user'); // Import User Model Schema
var TechReport = require('../models/techReport');
var RecReport = require('../models/recReport');


var permissions = require('./permissions');

/* GET all properties */
router.get('/', permissions.requireToken, function (req, res, next) {
  console.log("get all here");

  var token = req.headers['x-access-token'];

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(500).send({ message: 'Falha na autenticação do token.' });
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


/* REGISTER Property */
router.post('/register', permissions.requireProductor, function (req, res, next) {
  console.log("register property", req.body);
  Property.create(req.body, function (err, property) {

    if (err) {
      // Check if error is an error indicating duplicate account
      if (err.code === 11000) {
        res.status(400).json({ message: 'Este nome da propriedade já existe!.' }); // Return error
      } else {
        res.status(500).json({ message: 'Não foi possivel salvar a propriedade.' }); // Return error if not related to validation
      }
    } else {
      res.status(200).json({ id: property._id, nome: property.nome }); // Return success
    }
  });
});

/* GET Property by id*/
router.get('/:id', function (req, res, next) {
  console.log("get property by id");
  console.log(req.params);

  Property.findById(req.params.id, function (err, property) {

    if (err) {
      res.status(500).json({ message: "Não foi possivel encontrar a propriedade." });
    }
    if (!property) {
      res.status(404).json({ message: "Propriedade não encontrada." });
    }
    else {
      res.status(200).json({ id: property._id, nome: property.nome, areaTotal: property.areaTotal });
    }
  });
});

/* UPDATE Property */
router.put('/:id', function (req, res, next) {
  var query = { _id: req.params.id };
  console.log("query:", query);

  Property.findOneAndUpdate(query, req.body, function (err, property) {
    if (err) {
      res.status(500).json({ message: 'Não foi possivel editar a propriedade.' }); // Return error if not related to validation              
    } else {
      res.status(201).json({ id: property._id, nome: req.body.nome }); // Return success
    }
  });
});

/* DELETE Property */
router.delete('/:id', function (req, res, next) {
  console.log("delete property by id:", req.params);

  Property.findByIdAndRemove(req.params.id, function (err, property) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Não foi possivel remover a propriedade!" });
    } else {

      property.remove();

      console.log("deleted");
      res.status(204).send();
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

  Area.create(req.body, function (err, area) {

    if (err) {
      res.status(500).json({ message: 'Não foi possivel salvar a area. Error: ' }); // Return error if not related to validation              
    } else {
      res.status(201).json({ id: area._id, propriedadeId: area.propriedadeId, nome: area.nome, areaTotal: area.areaTotal, plantio: area.plantio, area: area.area }); // Return success
    }
  });
});

/* GET areas by id */
router.get('/areas/:id', function (req, res, next) {
  console.log("get areas by property id");
  console.log(req.params);
  
  Area.findById(req.params.id, function (err, area) {
    if (err) {
      res.status(500).json({message: "Erro ao encontrar a area"});
    } else  {
      if (!area)
        res.status(404).json({message: "Nâo foi possivel encontrar a area"});
      else
        res.status(200).json({id: area._id, propriedadeId: area.propriedadeId, nome: area.nome, areaTotal: area.areaTotal, plantio: area.plantio, area: area.area});
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
      res.status(500).json({ message: 'Erro ao tentar editar a area.' }); // Return error if not related to validation              
    } else {
      if (!area)
        res.status(404).json({message: "Nâo foi possivel encontrar a area"});
      else
        res.status(200).json({ id: area._id, nome: area.nome, areaTotal: area.areaTotal, plantio: area.plantio, area: area.area }); // Return success
    }
  });
});

/* DELETE Property */
router.delete('/areas/:id', function (req, res, next) {
  console.log("delete area by id:", req.params);

  Area.findByIdAndRemove(req.params.id, function (err, area) {
    if (err) {
      console.log(err);
      res.status(500).json({message: "Não foi possivel deletar a area"});
    }
    res.status(204).send();
  });
});

/*__________________________________________________Reports_________________________________________________________*/

/* Save Technical report */
router.post('/:proprieadeId/areas/:areaId/relatorio', function (req, res, next) {
  console.log("register tech report");
  console.log(req.body);
  TechReport.create(req.body, function (err, report) {
      if (err) {
          console.log(err);
          res.json({ success: false, message: 'Não foi possivel salvar o relatório. Error: ', err }); // Return error if not related to validation

      } else {
          res.status(201).json({ id: report._id }); // Return success
      }
  });
});


/* Save Project */
router.patch('/:propriedadeId/areas/:areaId/relatorio/:relatorioId/imagem', upload.single('fileToUpload'), async function (req, res, next) {

  

  
});

/* Save recomendation report */
router.post('/:proprieadeId/areas/:areaId/recomendacoes', function (req, res, next) {
  console.log("register recomendation report");
  console.log(req.body);
  RecReport.create(req.body, function (err, report) {

      if (err) {
          console.log(err);
          res.json({ success: false, message: 'Não foi possivel salvar o relatório de recomendação. Error: ', err }); // Return error if not related to validation

      } else {
          res.status(204).json({ id: report._id }); // Return success
      }
  });
});

/*______________________________________________Auxiliar function____________________________________________________*/


module.exports = router;