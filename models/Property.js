var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var PropertySchema = new mongoose.Schema({    
    nome: {type: String, required: true},
    areaTotal: {type: String, required: true},
    usuarioId: {type : mongoose.Schema.Types.ObjectId, ref : 'user'},

    // AreasOverlay: [{
    //   HarvestDate: String,
    //   HarvestType: String,
    //   AreaName: String,
    //   Area: Number,
    //   Coordinates: [ mongoose.Schema.Types.Mixed ],
    // }]   
  });

  PropertySchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            id: ret._id,
            nome: ret.nome,
            areaTotal: ret.areaTotal
        };
        return retJson;
    }
  });

  module.exports = mongoose.model('property', PropertySchema);