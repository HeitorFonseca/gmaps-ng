var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var RecReport = new mongoose.Schema({

    areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'area' },
    observacoes: { type: String, required: true },
    ponto: [
        {
            material1: Number,
            material2: Number,
            material3: Number,
            material4: Number,
            material5: Number,
            aplicacao: String, 
        }
    ]
});


module.exports = mongoose.model('recReport', RecReport);