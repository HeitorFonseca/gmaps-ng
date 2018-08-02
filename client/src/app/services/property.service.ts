import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { Property, AreasOverla0y, SamplingPoints } from '../../../../models/property';
import { Area } from '../models/property';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  domain = "http://localhost:3000/api/";

  constructor(private http: HttpClient, private router: Router) { }

  /*********************************** HTTP ***********************************/

  // Function to register property
  registerProperty(property: Property) {
    return this.http.post<any>(this.domain + 'propriedades/register', property).map(res => res);
  }

  // Function to edit property
  updatePropertyById(property: Property) {
    console.log("edit property called", property);
    return this.http.put<any>(this.domain + 'propriedades/' + property.id, property).map(res => res);
  }

  // Function to get properties
  getProperties() {
    return this.http.get(this.domain + 'propriedades/').map(res => res);
  }

  // Function to get properties by user id
  getPropertiesByUser(id) {
    return this.http.get<any>(this.domain + 'propriedades/clientes/' + id).map(res => res);
  }

  // Function to get properties by user id
  getPropertiesByTechnician(id) {
    return this.http.get<any>(this.domain + 'propriedades/tecnicos/' + id).map(res => res);
  }

  // Function to get properties by id
  getPropertyById(propId): Observable<Property> {
    return this.http.get<Property>(this.domain + 'propriedades/' + propId).map(res => res);
  }

  // Function to get properties by name
  deletePropertyById(id) {
    return this.http.delete(this.domain + 'propriedades/' + id).map(res => res);
  }

  getAreasByProperty(propertyId) {
    let params = new HttpParams();
    params = params.append('propriedadeId', propertyId);

    return this.http.get<Property>(this.domain + 'propriedades/' + propertyId + "/areas", { params: params }).map(res => res);
  }

  registerArea(propertyId, area) {
    return this.http.post<any>(this.domain + 'propriedades/' + propertyId + "/areas", area).map(res => res);
  }

  updateAreaById(area: Area) {
    console.log("edit property called", area);
    return this.http.put<any>(this.domain + 'propriedades/areas/' + area.id, area).map(res => res);
  }

  deleteAreaById(id) {
    console.log("remove area called", id);
    return this.http.delete(this.domain + 'propriedades/areas/' + id).map(res => res);
  }

  // TODO: ONLY FOR TEST - REMOVE
  registerPropertyAnalysis(analysis) {
    console.log(analysis);
    return this.http.post<any>(this.domain + 'analyses/registerAnalysis', analysis).map(res => res);
  }

  getPropertyAnalyses(propertyId) {

    let params = new HttpParams();
    params = params.append('propertyId', propertyId);

    return this.http.get<SamplingPoints>(this.domain + 'analyses/:propertyId', { params: params }).map(res => res);
  }

  getPropertyAnalysisPoints(propertyId, date, analysisId) {
    console.log("get property analysis points", propertyId, date, analysisId);
    let params = new HttpParams();
    params = params.append('propertyId', propertyId);
    params = params.append('date', date);
    params = params.append('analysisId', analysisId);

    return this.http.get<SamplingPoints>(this.domain + 'points/propertyId/date/analysisId', { params: params }).map(res => res);
  }

  registerTechReport(techReport) {

    return this.http.post<any>(this.domain + 'points/registerTechReport', techReport).map(res => res);

  }

}
