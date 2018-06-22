var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var PropertySchema = new mongoose.Schema({
    PropertyName: {type: String, required: true},
    OwnerId: {type: String, required: true},
    AreasOverlay: [{
      HarvestDate: String,
      HarvestType: String,
      AreaName: String,
      Area: Number,
      Lats: { type : Array , "default" : [] },
      Lngs: { type : Array , "default" : [] }
    }],
    Analyses: [{
      AnalysisId: {type: String, required: true},
      PropertyId: {type: String, required: true},
      AreaId: { type: String, required: true },      
      Type: { type: String, required: true },
      Date: { type: String, required: true },
    }],
    
  });

  module.exports = mongoose.model('property', PropertySchema);