import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'

import { AuthService } from '../../services/auth.service'

import {User} from "./../../models/user";

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

  constructor( private formBuilder: FormBuilder, 
               private authService: AuthService, 
               private router: Router,
               private permissionsService: NgxPermissionsService,
               private rolesService: NgxRolesService,
               private usrData:Data) {
                this.createForm(); // Create Login Form when component is constructed
                }

  ngOnInit() {
    //TODO FIX THIS WITH GUARD
    if (this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
  }


  createForm()
  {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  disableForm()
  {
    this.form.controls['email'].disable();
    this.form.controls['senha'].disable();
  }

  enableForm()
  {
    this.form.controls['email'].enable();
    this.form.controls['senha'].enable();
  }

  onLoginSubmit()
  {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm();     // Disable form while being process
    
    // Create user object from user's input
    const reqUser = {
      email: this.form.get('email').value, // Username input field
      senha: this.form.get('senha').value // Password input field
    }
    
    console.log(reqUser);

    this.authService.login(reqUser).subscribe(data => {
      
      console.log(data);
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;

        this.user = data.user as User;

        this.authService.storeUserData(data.token, data.user);        

        this.setUserPermissionsAndRole(this.user);

        this.authService.showNavBar.emit(true);
        
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);
      }
    });
    
  }

  
  onRegisterUser() {
    this.router.navigate(['/register']);
  }

  setUserPermissionsAndRole(user:User) {

    if (user.tipo) {
      var arr = new Array<any>();
      arr.push(user.tipo);
      this.permissionsService.loadPermissions(arr);
      console.log("Setou permissao para:", user.tipo);
      
    }
  }
}
