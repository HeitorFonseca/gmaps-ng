var express = require('express');
var router = express.Router();
var auth = require('authorized');

var SamplingPoints = require('../models/samplingPoints');
var TechReport = require('../models/techReport');

/* GET ALL PROPERTIES */
router.get('/:propertyId/:date/:analysisId', function (req, res, next) {
    console.log("get all points", req.params);
    console.log("get all points", req.query);

    var query = { PropertyId: req.query.propertyId, Date: req.query.date };
    console.log("query:", query);
    SamplingPoints.findOne(query, function (err, post) {
        if (err) return next(err);
        console.log(post);
        res.json(post);
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
                console.log("role:", user.tipo);
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