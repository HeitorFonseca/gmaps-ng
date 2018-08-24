import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';

import {environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }


  // Function to get properties
  getUser() {
    return this.http.get<any>(environment.domain + 'usuario/').map(res => res);
  }

  // Function to change user password
  changePassword(newPassword) {
    return this.http.patch<any>(environment.domain + 'usuario/senha', newPassword).map(res => res);
  }

  getTechnicians() {
    return this.http.get<any>(environment.domain + 'usuario/tecnicos').map(res => res);
  }

  // Function to change user password
  registerTechnicianToProductor(propId, tecnicoId) {
    return this.http.patch<any>(environment.domain + 'usuario/' + propId + '/tecnico', tecnicoId).map(res => res);
  }
  
}
