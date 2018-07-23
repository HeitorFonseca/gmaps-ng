var express = require('express');
var router = express.Router();

var Analysis = require('../models/analysis');

/* Get analyses by property */
router.get('/:propertyId', function (req, res, next) {

    var query = { PropertyId: req.query.propertyId };
    console.log("get analysis by property query:", query);
    Analysis.find(query, function (err, post) {
        if (err) return next(err);
        console.log(post);
        res.json(post);
    });
});

/* Fake request analyses */
router.post('/registerAnalysis', function (req, res, next) {
    console.log("register analysis");
    console.log(req.body);
    Analysis.create(req.body, function (err, post) {

        if (err) {
            console.log(err);
            res.json({ success: false, message: 'Não foi possivel salvar a analise. Error: ', err }); // Return error if not related to validation

        } else {
            console.log(post);
            res.json({ success: true, message: 'Analise registrada!', analysis: post }); // Return success
        }
    });
});

function requireAdmin(request, response, next) {

    User.findById({ _id: request.body.userId }, (err, user) => {
        if (err) {
            console.log("err");

            response.json({ success: false, message: err });
        } else {
            if (!user) {
                console.log("username not found:");

                response.json({ success: false, message: 'Username not found' });
            } else {
                console.log("role:", user.roles);
                if (user.roles[0] != 'produtor') {
                    response.json({ message: 'Permission denied.' });
                } else {
                    next();
                }
            }
        }
    });
}

module.exports = router;