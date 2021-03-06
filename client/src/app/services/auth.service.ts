import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from './../../environments/environment';

interface LoginData {
  success: string;
  message: string;
  token: string;
  user;
}


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  showNavBar = new EventEmitter<boolean>();
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  authToken;
  user;
  requestOptions;

  constructor(private http: HttpClient, private router: Router, private helper: JwtHelperService) { }

  // Function to register user accounts
  registerUser(email, name, password, type, hectare) {

    // Create user object from user's input
    const reqUser = {
      email: email,
      nome: name,
      senha: password,
      tipo: type,
      hectaresContratados: hectare
    }

    return this.http.post<any>(environment.domain + 'conta/nova', reqUser).map(res => res);
  }

  // Function to check if e-mail is taken
  forgotPassword(email) {
    let reqEmail = {
      email: email
    }
    return this.http.post<any>(environment.domain + 'conta/redefinir-senha/', reqEmail).map(res => res);
  }

  // Function to check if e-mail is taken
  changePassword(token, email, password) {
    let req = {
      token: token,
      email: email,
      senhaNova: password
    }
    return this.http.post<any>(environment.domain + 'conta/alterar-senha/', req).map(res => res);
  }

  // Function to login user
  login(email, password) {
    const reqUser = {
      email: email, 
      senha: password
    }
    // this.getLoggedInName.emit(user.username);
    return this.http.post<any>(environment.domain + 'conta/login', reqUser);
  }

  // Function to login user
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.showNavBar.emit(false);

  }

  // Function to store user's data in client local storage
  storeUserData(token, user) {
    localStorage.setItem('token', token); // Set token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
  }

  createAuthenticationHeaders() {
    this.loadToken();

    this.requestOptions = {
      params: new HttpParams()
    };

    this.requestOptions.params.set('Content-Type', 'application/json');
    this.requestOptions.params.set('authorization', this.authToken);
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  // Function to check if user is logged in
  loggedIn() {
    this.loadToken();

    console.log(this.authToken);
    console.log(this.helper.isTokenExpired(this.authToken));

    if (!this.helper.isTokenExpired(this.authToken)) {
      this.showNavBar.emit(true);

      return true;
    }


    this.router.navigate(['/login']);
    return false;
  }
}
