export class Property {
    _id: number;
    PropertyName: string;
    OwnerId: string;
    AreasOverlay: Array<AreasOverlay> = new Array<AreasOverlay>();    
    Analyses: Array<Analysis> = new Array<Analysis>();    
}

export class AreasOverlay {
    Area: string;
    AreaName: string;
    HarvestDate: string;
    HarvestType: string;
    Coordinates: Array<Array<number>> = new Array<Array<number>>();    
}

export class Analysis {
    _id: string;
    Id: string;
    PropertyId: string;
    Type: string;           // Analysis Type
    Date: string;           // Analysis Date    
}

export class SamplingPoints {
    Id: string;
    AnalysisId: string;
    Date: string;
    PropertyId: string;
    Geometry: Geometry;
}

export class Geometry {
    Coordinates: Array<Array<number>> = new Array<Array<number>>();
    Type: "Point";
}