import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }

  domain = "http://localhost:3000/api/";

  // Function to get properties
  getUser() {
    return this.http.get<any>(this.domain + 'usuario/').map(res => res);
  }

  changePassword(newPassword) {
    return this.http.patch<any>(this.domain + 'usuario/', newPassword).map(res => res);
  }

}
