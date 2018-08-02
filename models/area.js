var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var AreaSchema = new mongoose.Schema({    
    nome: {type: String, required: true},
    areaTotal: {type: String, required: true},
    propriedadeId: {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
    plantio: {type: String, required: true},
    area: [ mongoose.Schema.Types.Mixed ]
  });

  AreaSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            id: ret._id,
            nome: ret.nome,
            areaTotal: ret.areaTotal,
            plantio: ret.plantio,
            area: ret.area
        };
        return retJson;
    }
  });

  module.exports = mongoose.model('area', AreaSchema);