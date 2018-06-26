var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.Promise = global.Promise;

var PropertySchema = new mongoose.Schema({    
    PropertyName: {type: String, required: true},
    OwnerId: {type: String, required: true},
    AreasOverlay: [{
      HarvestDate: String,
      HarvestType: String,
      AreaName: String,
      Area: Number,
      Coordinates: [ mongoose.Schema.Types.Mixed ],
    }],
    Analyses: [{
      AnalysisId: {type: String, required: true},
      PropertyId: {type: String, required: true},
      AreaId: { type: String, required: true },      
      Type: { type: String, required: true },
      Date: { type: String, required: true },
    }],
    
  });

  PropertySchema.plugin(AutoIncrement, {inc_field: 'id'});

  module.exports = mongoose.model('property', PropertySchema);