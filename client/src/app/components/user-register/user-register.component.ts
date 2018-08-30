import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Messages } from '../../messages/messages';

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

    let email = this.form.get('email').value;
    let password =  this.form.get('senha').value;
    let name = this.form.get('name').value;
    
    this.authService.registerUser(email, name, password, 'produtor', 0).subscribe(data => {
      console.log("Registrou: ", data);

      this.setMessage('alert alert-success', Messages.SUC_USER_REGISTER);

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);

    }, err => {
      this.enableForm();  
      this.processing = false;      
      this.setMessage('alert alert-danger', err.error.message);
    });

  }

  setMessage(messageClass, message) {
    this.messageClass = messageClass;
    this.message = message;
  }

}
