const config = require('../config/database')
const jwt = require('jsonwebtoken');

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
    
            console.log("role:", decoded.type);
            if (user.tipo != 'produtor') {
                res.json({ success: false, message: 'Permission denied.' });
            } else {
                next();
            }
         
        });
    },

    requireProductorAndHectare: function(req, res, next) {

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
        });
    }
}

