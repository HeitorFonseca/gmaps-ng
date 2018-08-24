var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var AnalysisSchema = new mongoose.Schema({
    PropertyId: { type: String, required: true },
    Type: { type: String, required: true },
    Date: { type: String, required: true },
});

module.exports = mongoose.model('analyses', AnalysisSchema);