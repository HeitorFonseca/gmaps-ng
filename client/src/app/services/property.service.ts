import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { Property, SamplingPoints } from './../models/property';
import { Area } from '../models/property';

import {environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient, private router: Router) { }

  /*********************************** HTTP ***********************************/

  // Function to register property
  registerProperty(property: Property) {
    return this.http.post<any>(environment.domain + 'propriedades/register', property).map(res => res);
  }

  // Function to edit property
  updatePropertyById(property: Property) {
    console.log("edit property called", property.nome);
    return this.http.put<any>(environment.domain + 'propriedades/' + property.id, {nome:property.nome}).map(res => res);
  }

  // Function to get properties
  getProperties() {
    return this.http.get(environment.domain + 'propriedades/').map(res => res);
  }

  // Function to get properties by id
  getPropertyById(propId): Observable<Property> {
    return this.http.get<Property>(environment.domain + 'propriedades/' + propId).map(res => res);
  }

  // Function to get properties by user id
  getPropertiesByUser(id) {
    return this.http.get<any>(environment.domain + 'propriedades/clientes/' + id).map(res => res);
  }

  // Function to get properties by user id
  getPropertiesByTechnician(id) {
    return this.http.get<any>(environment.domain + 'propriedades/tecnicos/' + id).map(res => res);
  }

  // Function to get properties by name
  deletePropertyById(id) {
    return this.http.delete(environment.domain + 'propriedades/' + id).map(res => res);
  }

  getAreasByProperty(propertyId) {
    console.log("id:", propertyId);
    return this.http.get<any>(environment.domain + 'propriedades/' + propertyId + "/areas").map(res => res);
  }

  registerArea(propertyId, area) {
    return this.http.post<any>(environment.domain + 'propriedades/' + propertyId + "/areas", area).map(res => res);
  }

  updateAreaById(area: Area) {
    console.log("edit area called", area);
    return this.http.put<any>(environment.domain + 'propriedades/areas/' + area.id, area).map(res => res);
  }

  deleteAreaById(id) {
    console.log("remove area called", id);
    return this.http.delete(environment.domain + 'propriedades/areas/' + id).map(res => res);
  }

  // TODO: ONLY FOR TEST - REMOVE
  registerPropertyAnalysis(analysis) {
    console.log(analysis);
    return this.http.post<any>(environment.domain + 'analyses/registerAnalysis', analysis).map(res => res);
  }

  getPropertyAnalyses(propertyId) {

    let params = new HttpParams();
    params = params.append('propertyId', propertyId);

    return this.http.get<SamplingPoints>(environment.domain + 'analyses/:propertyId', { params: params }).map(res => res);
  }

  getPropertyAnalysisPoints(propertyId, date, analysisId) {
    console.log("get property analysis points", propertyId, date, analysisId);
    let params = new HttpParams();
    params = params.append('propertyId', propertyId);
    params = params.append('date', date);
    params = params.append('analysisId', analysisId);

    return this.http.get<SamplingPoints>(environment.domain + 'points/propertyId/date/analysisId', { params: params }).map(res => res);
  }

  registerTechReport(techReport) {

    return this.http.post<any>(environment.domain + 'points/registerTechReport', techReport).map(res => res);
  }

}
