import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Messages } from '../../../messages/messages';

import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-tech-register',
  templateUrl: './tech-register.component.html',
  styleUrls: ['./tech-register.component.css']
})
export class TechRegisterComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  disableForm() {
    this.form.controls['name'].disable();
    this.form.controls['email'].disable();
  }

  enableForm() {
    this.form.controls['name'].enable();
    this.form.controls['email'].enable();
  }

  onRegisterSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm();     // Disable form while being process

    let name = this.form.get('name').value as string;
    let splitName = name.toLowerCase().split(" ");
    let password = splitName[0] + splitName[splitName.length - 1];
    // Create user object from user's input
    const reqUser = {
      email: this.form.get('email').value,
      nome: name,
      senha: password,
      tipo: 'tecnico',
      hectaresContratados: 0
    }

    console.log(reqUser);

    this.authService.registerUser(reqUser).subscribe(data => {
      this.setMessage('alert alert-success', Messages.SUC_REGISTER_TECHNICIAN);
    }, err => {
      this.enableForm();
      this.createForm();
      this.processing = false;
      this.setMessage('alert alert-danger', err.error.message);      
    });

  }
  
  setMessage(messageClass, message) {
    this.messageClass = messageClass;
    this.message = message;
  }

}
