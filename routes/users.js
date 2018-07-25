var express = require('express');
var router = express.Router();
const User = require('../models/user'); // Import User Model Schema
const config = require('../config/database')
const bcrypt = require('bcrypt-nodejs');

const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.


router.get('/', function (req, res) {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ auth: false, message: 'Nenhum token fornecido.' });
    console.log("get user", token);

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Falha na autenticação do token.' });
        }

        User.findById(decoded.userId, { senha: 0 }, function (err, user) {
            if (err) return res.status(500).send("Encontramos problema ao encontrar o usuário.");
            if (!user) return res.status(404).send("Nenhum usuário encontrado.");
            //res.status(200).send(user); //Comment this out!
            res.json({ user: { nome: user.nome, email: user.email, tipo: user.tipo, hectaresContratados: user.hectaresContratados } })
            //next(user); // add this line
        });
    });
});

router.put('/', function (req, res) {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ auth: false, message: 'Nenhum token fornecido.' });
    console.log("put user", token);

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Falha no token.' });
        }        

        User.findByIdAndUpdate(decoded.userId, req.body, function (err, post) {
            if (err) {
                res.json({ success: false, message: 'Não foi possivel editar o usuário: ', err }); // Return error if not related to validation              
            } else {
                res.json({ success: true, message: 'Usuário editado!' }); // Return success
            }
        });
    });
});

router.patch('/senha', function (req, res) {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ auth: false, message: 'Nenhum token fornecido.' });
    console.log("patch usuario senha", token);
    console.log("body", req.body);
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Falha no token.' });
        }

        User.findById(decoded.userId, function(err, user) {

            const validPassword = user.comparePassword(req.body.senhaAtual);
            if (!validPassword) {
                res.json({ success: false, message: 'Senha e senha atual são diferentes' });
            } 

            user.senha = req.body.senhaNova;

            user.save((err) => {
                if (err)
                    res.json({ success: false, message: 'Senha não pode ser alterada' });
                else {
                    res.json({ success: true, message: 'Senha alterada' });
                }
            })
        });

        
        // console.log("body", req.body);
        // const validPassword = user.comparePassword(req.body.senhaAtual);
        // if (!validPassword) {
        //     res.json({ success: false, message: 'Senha e senha atual são diferentes' });
        // } 

        // bcrypt.hash(newPassword, (hash) => {
        //     req.body.senhaNova = newPassword;

        //     User.findByIdAndUpdate(decoded.userId, req.body, function (err, post) {
        //         if (err) {
        //             res.json({ success: false, message: 'Não foi possivel alterar a senha: ', err }); // Return error if not related to validation              
        //         } else {
        //             res.json({ success: true, message: 'Senha alterada!' }); // Return success
        //         }
        //     });
        // });        
    });
});


module.exports = router;