import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,) {
    this.createForm();
   }

  ngOnInit() {

  }

  createForm()
  {
    this.form = this.formBuilder.group({
      name:  ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  disableForm()
  {
    this.form.controls['name'].disable();
    this.form.controls['email'].disable();
    this.form.controls['senha'].disable();
  }

  enableForm()
  {
    this.form.controls['name'].enable();
    this.form.controls['email'].enable();
    this.form.controls['senha'].enable();
  }

  onRegisterSubmit()
  {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm();     // Disable form while being process
    
    // Create user object from user's input
    const reqUser = {
      email: this.form.get('email').value, // Username input field
      senha: this.form.get('senha').value // Password input field
    }
    
    console.log(reqUser);

    this.authService.registerUser(reqUser).subscribe(data => {
      
      console.log(data);
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
      
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
    
  }

}
