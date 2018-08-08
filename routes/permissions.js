const config = require('../config/database')
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import User Model Schema

module.exports = {
    requireToken:function (req, res, next) {

        var token = req.headers['x-access-token'];
    
        if (!token) {
            return res.status(401).send({ success: false, message: 'Nenhum token fornecido.' });
        }
        else {
            next();
        }
    },

    requireAdmin: function(req, res, next) {

        var token = req.headers['x-access-token'];
    
        if (!token) return res.status(401).send({ success: false, message: 'Nenhum token fornecido.' });
        console.log("get user", token);
    
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log(err);
                console.log("falha na autenticacao");
                return res.status(500).send({ success: false, message: 'Falha na autenticação do token.' });
            }
            
            console.log("role:", decoded.type);

            if (decoded.type != 'administrador') {
                res.json({ success: false, message: 'Permission denied.' });
            } else {
                next();
            }            
        });
    },

    requireProductor: function (req, res, next) {

        var token = req.headers['x-access-token'];
    
        if (!token) return res.status(401).send({ success: false, message: 'Nenhum token fornecido.' });
        console.log("get user", token);
    
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log(err);
                console.log("falha na autenticacao");
                return res.status(500).send({ success: false, message: 'Falha na autenticação do token.' });
            }
    
            console.log("role p:", decoded.type);
            if (decoded.type != 'produtor') {
                res.status(401).json({ message: 'Permission denied.' });
            } else {
                next();
            }
         
        });
    },

    requireProductorAndHectare: function(req, res, next) {

        var token = req.headers['x-access-token'];        
    
        if (!token) { 
            return res.status(401).send({message: 'Nenhum token fornecido.' });
        }
        console.log("get user hectare:", token);
    
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log("error->:", err);
                return res.status(500).send({ message: 'Falha na autenticação do token.' });
            }
    

            User.findById(decoded.userId, { senha: 0 }, function (err, user) {
                if (err) { 
                    return res.status(500).send({ message: "Encontramos problema ao encontrar o usuário." });
                }

                if (!user) {
                    return res.status(404).send({ message: "Nenhum usuário encontrado." });
                }
    
                console.log("role:", user);
                if (user.tipo != 'produtor') {
                    res.status(401).json({ message: 'Voce não tem permissão para esta ação' });
                }
                else if (user.hectaresRestantes < req.body.areaTotal) {
                    res.status(200).json({ message: 'Hectares insuficientes' })
                }
                else {
                    next();
                }
            });
        });
    }
}

