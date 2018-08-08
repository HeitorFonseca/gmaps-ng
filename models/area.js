var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var AreaSchema = new mongoose.Schema({    
    nome: {type: String, required: true},
    areaTotal: {type: String, required: true},
    propriedadeId: {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
    plantio: {type: String, required: true},
    area: [ mongoose.Schema.Types.Mixed ]
  });

//   AreaSchema.set('toJSON', {
//     transform: function(doc, ret, options) {
//         var retJson = {
//             id: ret._id,
//             propriedadeId: ret.propriedadeId
//             nome: ret.nome,
//             area: ret.area,
//             areaTotal: ret.areaTotal,
//             plantio: ret.plantio,            
//         };
//         return retJson;
//     }
//   });

  module.exports = mongoose.model('area', AreaSchema);