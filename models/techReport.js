var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var TechReport = new mongoose.Schema({

  areaId: {type : mongoose.Schema.Types.ObjectId, ref : 'area'},
  ponto: Number, 
  analisesDoSolo: { type: String, required: true },
  compactacao: { type: String, required: true },
  data: { type: String, required: true },
  tipoAvaliacao :  String,
  materiaSeca : {
    material : String,
    peso : Number
  },
  comentarios: { type: String, required: true },
  sementesPorMetros: Number,
  plantasPorMetros: Number,
  germinacaoReal: Number,
  distribuicao: [[Number]],
  estatisticasSementes: [{ 
    desvioPadrao: Number,
    coeficienteDeVairacao: Number,
    distanciaMedia: Number
  }],
  estatisticasPlantas: [{
    distanciaMedia: Number
  }],
});


module.exports = mongoose.model('techReport', TechReport);