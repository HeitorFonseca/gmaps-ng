export class TechReport {
    SamplingPointId: number;
    CoverEvaluation: {
        PropertyName: string,
        ClientName: string,
        Allotment: string,
        PointNumber: string,
        Latitude: string,
        Longitude: string,
        SoilAnalysis: string,
        Compaction: string,
        EvaluationType: string,
        Date: string,
        Material: string,
        Weight: string,
        ExtraComments: string,
    };

    SowingEvaluation: {
        SoilHumidity: string,
        Desiccation: string,
        ExtraComments: string,
        SowingData: string,
        Sower: string,
        Depth: string,
        Spacing: string,
        Cultivation: string,
        Germination: string,
        SeedDistribution: {
            Linea1: [{
                P1: string,
                P2: string,
            }],
            Linea2: [{
                P1: string,
                P2: string,
            }]
        },
        TotalSeedsIn4Meters: string,
        ExtraComments2: string,
    };

    PlantEvaluation: {
        PropertyName: string,
        Allotment: string,
        Latitude: string,
        Longitude: string,
        PlantStage: string,
        Date: string,
        PlantDistribution: {
            Linea1: [{
                P1: string,
                P2: string,
            }],
            Linea2: [{
                P1: string,
                P2: string,
            }]
        },
        TotalPlantsIn10Meters: string,
    };
}