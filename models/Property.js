var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var PropertySchema = new mongoose.Schema({
    PropertyName: String,
    Area: Number,
    AreasOverlay: [{
      //Address: String,
      HarvestDate: String,
      AreaName: String, 
      Lats: { type : Array , "default" : [] },
      Lngs: { type : Array , "default" : [] }
    }]
    
  });

  module.exports = mongoose.model('property', PropertySchema);