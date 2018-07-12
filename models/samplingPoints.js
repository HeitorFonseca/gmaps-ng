var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const AutoIncrement = require('mongoose-sequence')(mongoose);


var SamplingPoints = new mongoose.Schema({
    Id: { type: Number, required: true },
    PropertyId: { type: String, required: true },
    AnalysisId: { type: String, required: true },
    Date: { type: String, required: true },
    Geometry: [{
        Coordinates: [mongoose.Schema.Types.Mixed],
        Type: String,
    }]
});

// SamplingPoints.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('samplingpoints', SamplingPoints);