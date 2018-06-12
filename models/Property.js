var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var PropertySchema = new mongoose.Schema({
    PropertyName: String,
    AreasOverlay: [{
      //Address: String,
      HarvestDate: String,
      HarvestType: String,
      AreaName: String,
      Area: Number,
      Lats: { type : Array , "default" : [] },
      Lngs: { type : Array , "default" : [] }
    }]
    
  });

  module.exports = mongoose.model('property', PropertySchema);