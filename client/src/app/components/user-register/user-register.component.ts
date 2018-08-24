import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {Messages} from '../../messages/messages'

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
    private router: Router,
    ) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  disableForm() {
    this.form.controls['name'].disable();
    this.form.controls['email'].disable();
    this.form.controls['senha'].disable();
  }

  enableForm() {
    this.form.controls['name'].enable();
    this.form.controls['email'].enable();
    this.form.controls['senha'].enable();
  }

  onRegisterSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm();     // Disable form while being process

    // Create user object from user's input
    const reqUser = {
      email: this.form.get('email').value, // Username input field
      senha: this.form.get('senha').value, // Password input field
      nome: this.form.get('name').value,
      tipo: 'produtor',
      hectaresContratados: 0
    }

    //console.log(reqUser);

    this.authService.registerUser(reqUser).subscribe(data => {
      console.log("Registrou: ", data);

      this.setMessage('alert alert-success', Messages.SUC_USER_REGISTER);      

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);

    }, err => {
      console.log("Error:", err);
      if (err.error) {
        this.enableForm();
        this.messageClass = 'alert alert-danger';
        this.message = err.error.message;
        this.processing = false;
      }

    });

  }

  setMessage(messageClass, message){
    this.messageClass = messageClass;
    this.message = message;
  }

}
