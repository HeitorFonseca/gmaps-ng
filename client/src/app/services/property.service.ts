import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { Property, AreasOverla0y, SamplingPoints } from '../../../../models/property';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  domain = "http://localhost:3000/api/";

  constructor(private http: HttpClient, private router: Router) { }

  /*********************************** HTTP ***********************************/

  // Function to register property
  registerProperty(property:Property) {
    return this.http.post<any>(this.domain + 'property/register', property).map(res => res);
  }

  // Function to edit property
  editProperty(property:Property) {
    console.log("edit called", property);
    return this.http.put<any>(this.domain + 'property/name', property).map(res => res);
  }

  // Function to get properties
  getProperties() {
    return this.http.get(this.domain + 'property/').map(res => res);
  }

  // Function to get properties
  getPropertiesByUser(id) {
    let params = new HttpParams();
    params = params.append('userId', id);

    return this.http.get(this.domain + 'property/:userId', {params: params}).map(res => res);
  }

  // Function to get properties by name
  getPropertyByName(id, name): Observable<Property> {
    let params = new HttpParams();
    params = params.append('userId', id);
    params = params.append('name', name);

    return this.http.get<Property>(this.domain + 'property/:userId/:name', {params: params}).map(res => res);
  }

   // Function to get properties by name
   deletePropertyByName(name) {
    console.log("deletePropertyByName", name)
    let params = new HttpParams();
    params = params.append('name', name);

    return this.http.delete(this.domain + 'property/name', {params: params}).map(res => res);
  }

  // TODO: ONLY FOR TEST - REMOVE
  registerPropertyAnalysis(analysis) {    
    console.log(analysis);
    return this.http.post<any>(this.domain + 'analyses/registerAnalysis', analysis).map(res => res);
  }

  getPropertyAnalyses(propertyId) {

    let params = new HttpParams();
    params = params.append('propertyId', propertyId);

    return this.http.get<SamplingPoints>(this.domain + 'analyses/:propertyId', {params: params}).map(res => res);
  }

  getPropertyAnalysisPoints(propertyId, date, analysisId) {
    console.log("get property analysis points", propertyId, date, analysisId);
    let params = new HttpParams();
    params = params.append('propertyId', propertyId);
    params = params.append('date', date);
    params = params.append('analysisId', analysisId);

    return this.http.get<SamplingPoints>(this.domain + 'points/propertyId/date/analysisId', {params: params}).map(res => res);
  }

  registerTechReport(techReport) {

    return this.http.post<any>(this.domain + 'points/registerTechReport', techReport).map(res => res);

  }

}
