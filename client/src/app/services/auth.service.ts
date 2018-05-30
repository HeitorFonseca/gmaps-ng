import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


interface myData {
  success: boolean,
  message: string
}

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

  domain = "http://localhost:3000/api/";
  authToken;
  user;
  requestOptions;

  constructor(private http: HttpClient) { }

  // Function to register user accounts
  registerUser(user) {
    return this.http.post(this.domain + 'authentication/register', user).map(res => res);
  }

  // Function to check if username is taken
  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username).map(res => res);
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(res => res);
  }

  // Function to login user
  login(user) {
    console.log(user);
    return this.http.post<any>(this.domain + 'authentication/login', user);
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
}
