import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'

import { AuthService } from '../../services/auth.service'

import {User} from "./../../models/user.model";

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
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  disableForm()
  {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm()
  {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit()
  {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm();     // Disable form while being process
    
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }
    
    console.log(user);

    this.authService.login(user).subscribe(data => {
      
      console.log(data);
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.storeUserData(data.token, data.user);        

        this.setUserPermissionsAndRole(data);

        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      }
    });
    
  }

  setUserPermissionsAndRole(data:any) {
    var permissions = this.usrData.getPropertyOwnerPermissions();
    this.permissionsService.loadPermissions(permissions);

    if (data.user.roles) {
      let roles = data.user.roles;

      for (let role of roles) {
        var perm:string[] = [""];

        if (role == "ADMIN") {
          perm = this.usrData.getPropertyOwnerPermissions();
          console.log("entrou", perm);
        }
        else if (role == "TECHNICIAN") {
          perm = this.usrData.getTechnicianPermissions();
        }  
        
        console.log("setou data permissions and role");
        
        localStorage.setItem('role', role);

        this.rolesService.addRole(role, perm)
      }
    }
  }
}
