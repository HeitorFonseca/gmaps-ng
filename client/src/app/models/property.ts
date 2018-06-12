export class Property {

    PropertyName: string;
    Area: string;
    AreasOverlay: Array<AreasOverlay> = new Array<AreasOverlay>();
}


export class AreasOverlay {
    AreaName: string;
    HarvestDate: string;
    Lats: Array<string> = new Array<string>();
    Lngs: Array<string> = new Array<string>();
}