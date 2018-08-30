import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'

import { Messages } from '../../messages/messages';
import { AuthService } from '../../services/auth.service'
import { User } from "./../../models/user";
import { Data } from "./../../providers/data";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;

  user: User = new User();

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private permissionsService: NgxPermissionsService,
    private rolesService: NgxRolesService,
    private usrData: Data) {
    this.createForm(); // Create Login Form when component is constructed
  }

  ngOnInit() {
    //TODO FIX THIS WITH GUARD
    if (this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
  }


  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['senha'].disable();
  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['senha'].enable();
  }

  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm();     // Disable form while being process

    // Create user object from user's input

     let email = this.form.get('email').value; // Username input field
     let password =  this.form.get('senha').value; // Password input field
  

    this.authService.login(email, password).subscribe(data => {
      this.setMessage('alert alert-success', Messages.SUC_USER_LOGIN);
      this.user = data.user as User;
      this.authService.storeUserData(data.token, data.user);
      this.setUserPermissionsAndRole(this.user);
      this.authService.showNavBar.emit(true);
      // Redirect to home
      setTimeout(() => {
        this.router.navigate(['']);
      }, 1500);
    }, err => {
      this.processing = false;
      this.enableForm();
      this.setMessage('alert alert-danger', err.error.message);      
    });

  }


  onRegisterUser() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    let email = this.form.get('email').value;

    if (email) {
      this.authService.forgotPassword(email).subscribe(data => {
        this.setMessage('alert alert-success', Messages.SUC_FORGOT_PASSWORD);    
      }, err => {
        this.processing = false;
        this.enableForm();
        this.setMessage('alert alert-danger', err.error.message);        
      });
    }
  }

  setUserPermissionsAndRole(user: User) {

    if (user.tipo) {
      var arr = new Array<any>();
      arr.push(user.tipo);
      this.permissionsService.loadPermissions(arr);
      console.log("Setou permissao para:", user.tipo);
    }
  }

  setMessage(messageClass, message) {
    this.messageClass = messageClass;
    this.message = message;
  }
}
