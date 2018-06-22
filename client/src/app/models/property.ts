export class Property {
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
    Lats: Array<string> = new Array<string>();
    Lngs: Array<string> = new Array<string>();
}

export class Analysis {
    AnalysisId: string;
    AreaId: string;
    Type: string;
    Date: string;
    // Response: string;
}