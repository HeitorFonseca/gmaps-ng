var express = require('express');
var router = express.Router();
const config = require('../config/database')
const bcrypt = require('bcrypt-nodejs');
var permissions = require('./permissions');

const User = require('../models/user'); // Import User Model Schema
const Property = require('../models/property'); // Import Property Model Schema
const Area = require('../models/area'); // Import Area Model Schema


const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.

/* REGISTER client user */
router.post('/', (req, res) => {
    console.log(req.body);
    // Check if email was provided
    if (!req.body.email) {
        res.status(400).json({ message: 'Voce deve fornecer um e-mail' }); // Return error
    } else {
        // Check if nome was provided
        if (!req.body.nome) {
            res.status(400).json({ message: 'Voce deve fornecer um nome' }); // Return error
        } else {
            // Check if password was provided
            if (!req.body.senha) {
                res.status(400).json({ message: 'Voce deve fornecer uma senha' }); // Return error
            } else {
                if (!req.body.tipo) {
                    res.status(400).json({ message: 'Voce deve fornecer um tipo' }); // Return error
                }
                else {
                    // Create new user object and apply user input
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        nome: req.body.nome.toLowerCase(),
                        senha: req.body.senha,
                        tipo: req.body.tipo,
                    });
                    // Save user to database
                    user.save((err) => {
                        // Check if error occured
                        if (err) {
                            // Check if error is an error indicating duplicate account
                            if (err.code === 11000) {
                                res.status(400).json({ message: 'Email já cadastrado' }); // Return error
                            } else {
                                // Check if error is a validation rror
                                if (err.errors) {
                                    // Check if validation error is in the email field
                                    if (err.errors.email) {
                                        res.status(400).json({ message: err.errors.email.message }); // Return error
                                    } else {
                                        // Check if validation error is in the nome field
                                        if (err.errors.nome) {
                                            res.status(400).json({ message: err.errors.nome.message }); // Return error
                                        } else {
                                            // Check if validation error is in the password field
                                            if (err.errors.senha) {
                                                res.status(400).json({ message: err.errors.senha.message }); // Return error
                                            } else {
                                                res.status(400).json({ message: err }); // Return any other error not already covered
                                            }
                                        }
                                    }
                                } else {
                                    res.status(500).json({ message: 'Não foi possivel salvar o usuário. Erro: ', err }); // Return error if not related to validation
                                }
                            }
                        } else {
                            res.status(200).json({ message: 'Conta registrada!', id: user._id, nome: user.nome, email: user.email, tipo: user.tipo }); // Return success
                        }
                    });
                }
            }
        }
    }
});

/* GET client user */
router.get('/:id', function (req, res, next) {
    console.log("get client user by id");
    console.log(req.params);

    User.findById(req.params.id, function (err, user) {

        if (err) {
            res.status(500).json({ message: "Não foi possivel encontrar a propriedade." });
        }
        if (!user) {
            res.status(404).json({ message: "Cliente não encontrado." });
        }
        else {
            res.status(200).json({ id: user._id, nome: user.nome, tipo: user.tipo });
        }
    });
});

/* PUT client user */
router.put('/:id', function (req, res, next) {

    var query = { _id: req.params.id };
    console.log("put client user:", query);

    User.findOneAndUpdate(query, req.body, function (err, user) {
        if (err) {
            res.status(500).json({ message: 'Não foi possivel editar o cliente.' }); // Return error if not related to validation              
        } else {
            res.status(201).json({ message: 'Cliente editado!', id: user._id, nome: user.nome, tipo: user.tipo }); // Return success
        }
    });
});

/* DELETE client user */
router.delete('/:id', function (req, res, next) {
    console.log("delete client user by id:", req.params);

    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) {
            res.status(500).json({ message: "Não foi possivel remover o cliente!" });
        } else {

            user.remove();

            console.log("deleted");
            res.status(204).json({ message: "Cliente deletado!." });
        }
    });
});


/* GET properties by user type */
router.get('/propriedades', permissions.requireToken, function (req, res, next) {
    console.log("get all here");

    var token = req.headers['x-access-token'];

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            console.log(err);
            console.log("falha na autenticacao");
            return res.status(500).send({ success: false, message: 'Falha na autenticação do token.' });
        }

        console.log("usr id", decoded.userId);
        console.log("tipo é:", decoded.type);
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
            return res.status(500).send({ success: false, message: "Operação não permitida!" });
        }
        console.log("query", query);
        Property.aggregate([
            { $match: query },
            {
                $lookup: {
                    localField: "usuarioId",
                    from: "users",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            { $unwind: "$usuario" },
            { $addFields: { id: "$_id" } },
            { $addFields: { cliente: { id: '$usuario._id', nome: '$usuario.nome' } } },
            {
                $project: { _id: 0, usuarioId: 0, tecnicoId: 0, usuario: 0 }
            }
        ], function (err, properties) {
            if (err) {
                console.log("error", err);
                res.status(500).json({ success: false, message: 'Não foi possivel retornar as propriedades. Erro: ', err });
            }
            else {
                console.log("propriedades:", properties);
                res.status(200).json(properties);
            }
        });
    });
});


/* GET single property by id */
router.get('/propriedades/:propriedadeId', permissions.requireToken, function (req, res, next) {
    console.log("get property by id");
    console.log(req.params);

    var query = { _id: mongoose.Types.ObjectId(req.params.propriedadeId) };

    Property.aggregate([
        { $match: query },
        {
            $lookup: {
                localField: "usuarioId",
                from: "users",
                foreignField: "_id",
                as: "usuario"
            }
        },
        { $unwind: "$usuario" },
        { $addFields: { id: "$_id" } },
        { $addFields: { cliente: { id: '$usuario._id', nome: '$usuario.nome' } } },
        {
            $project: { _id: 0, usuarioId: 0, tecnicoId: 0, usuario: 0 }
        }
    ], function (err, property) {
        if (err) {
            console.log("error", err);
            res.json({ success: false, message: 'Não foi possivel retornar as propriedades. Erro: ', err });
        }
        else {
            console.log("propriedade:", property);
            res.json(property[0]);
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
            res.status(500).json({ message: "Nâo foi possivel encontrar as areas" });
        } else {

            areas = areas.map(element => {
                return {
                    id: element._id, propriedadeId: element.propriedadeId, nome: element.nome,
                    areaTotal: element.areaTotal, plantio: element.plantio, area: element.area, ultimaAtualizacao: element.ultimaAtualizacao
                };
            });

            res.status(200).json(areas);
        }
    });
});

/* GET areas by id */
router.get('proprieades/:proprieadeId/areas/:areaId', function (req, res, next) {
    console.log("get areas by property id");
    console.log(req.params);

    Area.findById(req.params.areaId, function (err, area) {
        if (err) {
            res.status(500).json({ message: "Nâo foi possivel encontrar a area" });
        } else {
            res.status(200).json({ id: area._id, propriedadeId: area.propriedadeId, nome: area.nome, 
                                   areaTotal: area.areaTotal, plantio: area.plantio, area: area.area,
                                   temMapaProducao: area.temMapaProducao, temPontosAmostragem: area.temPontosAmostragem,
                                   temPrevisaoProdutividade: area.temPrevisaoProdutividade,  temRecomendacoes: area.temRecomendacoes    });
        }
    });
});

module.exports = router;