var mongoose = require('mongoose');
var Area = require('./area');

mongoose.Promise = global.Promise;

var PropertySchema = new mongoose.Schema({    
    nome: {type: String, required: true},
    areaTotal: {type: String, required: true},
    usuarioId: {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
    tecnicoId: {type : mongoose.Schema.Types.ObjectId, ref : 'user'}
  });

  PropertySchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            id: ret._id,
            nome: ret.nome,
            areaTotal: ret.areaTotal,
            usuarioId: ret.usuarioId
        };
        return retJson;
    }
  });

  PropertySchema.pre('remove', function (next) {
    Area.remove({ propriedadeId: this._id }).exec();
    next();
  });
  
  

  module.exports = mongoose.model('property', PropertySchema);