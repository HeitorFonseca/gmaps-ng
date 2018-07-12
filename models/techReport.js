var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AutoIncrement = require('mongoose-sequence')(mongoose);


var TechReport = new mongoose.Schema({

  SamplingPointId: Number,
  CoverEvaluation: {
    PropertyName: { type: String, required: true },
    ClientName: { type: String, required: true },
    Allotment: { type: String },
    PointNumber: { type: String, required: true },
    Latitude: { type: String, required: true },
    Longitude: { type: String, required: true },
    SoilAnalysis: { type: String },
    Compaction: { type: String },
    EvaluationType: { type: String },
    Date: { type: String },
    Material: { type: String },
    Weight: { type: String },
    ExtraComments: { type: String }
  },

  SowingEvaluation: {
    SoilHumidity: { type: String },
    Desiccation: { type: String },
    ExtraComments: { type: String },
    SowingData: { type: String },
    Sower: { type: String },
    Depth: { type: String },
    Spacing: { type: String },
    Cultivation: { type: String },
    Germination: { type: String },
    SeedDistribution: {
      Linea1: [{
        P1: { type: String },
        P2: { type: String },
      }],
      Linea2: [{
        P1: { type: String },
        P2: { type: String },
      }]
    },
    TotalSeedsIn4Meters: { type: String },
    ExtraComments2: { type: String },
  },

  PlantEvaluation: {
    PropertyName: { type: String },
    Allotment: { type: String },
    Latitude: { type: String },
    Longitude: { type: String },
    PlantStage: { type: String },
    Date: { type: String },
    PlantDistribution: {
      Linea1: [{
        P1: { type: String },
        P2: { type: String },
      }],
      Linea2: [{
        P1: { type: String },
        P2: { type: String },
      }]
    },
    TotalPlantsIn10Meters: { type: String },
  }
});


TechReport.plugin(AutoIncrement, { inc_field: 'techReportId' });

module.exports = mongoose.model('techreport', TechReport);