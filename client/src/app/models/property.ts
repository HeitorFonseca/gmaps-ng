export class Property {

    PropertyName: string;
    AreasOverlay: Array<AreasOverlay> = new Array<AreasOverlay>();
}


export class AreasOverlay {
    Area: string;
    AreaName: string;
    HarvestDate: string;
    HarvestType: string;
    Lats: Array<string> = new Array<string>();
    Lngs: Array<string> = new Array<string>();
}