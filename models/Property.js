var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var PropertySchema = new mongoose.Schema({
    name: String,
    harvestDate: String,
    Area: Number,
    Address: String
  });

  module.exports = mongoose.model('property', PropertySchema);