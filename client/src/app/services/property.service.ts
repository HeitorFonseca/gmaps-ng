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

  constructor(private http: HttpClient, private router: Router) { }

  /*********************************** HTTP ***********************************/

  // Function to register property
  registerProperty(property:Property) {
    return this.http.post(this.domain + 'property/register', property).map(res => res);
  }

  // Function to get properties
  getProperties() {
    return this.http.get(this.domain + 'property/').map(res => res);
  }

  // Function to get properties by name
  getPropertyByName(name): Observable<Property> {
    //console.log("getPropertyByName", name)
    let params = new HttpParams();
    params = params.append('name', name);

    return this.http.get<Property>(this.domain + 'property/name', {params: params}).map(res => res);
  }

   // Function to get properties by name
   deletePropertyByName(name) {
    console.log("deletePropertyByName", name)
    let params = new HttpParams();
    params = params.append('name', name);

    return this.http.delete(this.domain + 'property/name', {params: params}).map(res => res);
  }

}
