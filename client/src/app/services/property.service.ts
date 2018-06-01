import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  public propertyAreaSubject = new Subject<any>();
  public deleteSelectedOverlay = new Subject<any>();

  constructor() { }

  addArea(data)
  {
    this.propertyAreaSubject.next(data);
  }

  cancelPolygon()
  {
    this.deleteSelectedOverlay.next();
  }

}
