import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  messageClass;
  message;
  processing = false;

  tokenParameter:string;
  form: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.tokenParameter = this.route.snapshot.paramMap.get('token');

    this.createForm();  
  }


  createForm() {
    this.form = this.formBuilder.group({     
      email: ['', Validators.required],
      senha1: ['', Validators.required],
      senha2: ['', Validators.required]
    });
  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['senha1'].disable();
    this.form.controls['senha2'].disable();
  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['senha1'].enable();
    this.form.controls['senha2'].enable();
  }

  onChangePasswordSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm();     // Disable form while being process
  }
}
