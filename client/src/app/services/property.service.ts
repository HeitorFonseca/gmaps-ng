import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { Property, AreasOverlay } from '../../../../models/property';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  domain = "http://localhost:3000/api/";

  public propertyAreaSubject = new Subject<any>();
  public propertyAreaNameSubject = new Subject<any>();
  public deleteSelectedOverlay = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { }

  
  // Function to register property
  registerProperty(property:Property) {
    return this.http.post(this.domain + 'property/register', property).map(res => res);
  }

  // Function to get properties
  getProperties() {
    return this.http.get(this.domain + 'property/').map(res => res);
  }

  // Function to get properties
  getPropertiyByName(name): Observable<Property> {
    console.log("parameter", name)
    let params = new HttpParams();
    params = params.append('name', name);

    return this.http.get<Property>(this.domain + 'property/name', {params: params}).map(res => res);
  }

  // Function to add area in property area field
  addArea(data)
  {
    this.propertyAreaSubject.next(data);
  }

  // Function to add area in property area field
  addAreaName(data)
  {
    console.log(data);
    this.propertyAreaNameSubject.next(data);
  }

  // Function to delete area when click in cancel button
  cancelPolygon(id)
  {
    this.deleteSelectedOverlay.next(id);
  }

}
