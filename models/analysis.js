var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var AnalysisSchema = new mongoose.Schema({
    AreaId: {type: String, required: true},
    Type: { type: String, required: true },
    Date: { type: String, required: true },
    Response : { type: String, required: true }
    
  });

  module.exports = mongoose.model('analysis', AnalysisSchema);