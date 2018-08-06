export class Property {
    id: number;
    nome: string;
    areaTotal: number = 0;
    usuarioId: string;
    tecnicoId: string;
    // AreasOverlay: Array<AreasOverlay> = new Array<AreasOverlay>();    
    // Analyses: Array<Analysis> = new Array<Analysis>();    
}

export class Area {
    id: string;
    propriedadeId: string;
    nome: string;
    areaTotal: number = 0;
    plantio: string;
    area: Array<Array<number>> = new Array<Array<number>>();    
    imagem: string;    
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