var mongoose = require('mongoose');

const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.Promise = global.Promise;

var SamplingPoints = new mongoose.Schema({
    //Id: {type: Number, required: true},
    PropertyId: {type: String, required: true},
    AnalysisId:  {type: String, required: true},
    Date: {type: String, required: true},
    Geometry: [{
      Coordinates: [ mongoose.Schema.Types.Mixed ],
      Type: String,     
    }],
    // Properties: [{
    //   AnalysisId: {type: String, required: true},
    //   PropertyId: {type: String, required: true},
    //   Value: { type: Number, required: true }        
    // }],
    
  });

  SamplingPoints.plugin(AutoIncrement, {inc_field: 'id'});

  module.exports = mongoose.model('samplingPoints', SamplingPoints);