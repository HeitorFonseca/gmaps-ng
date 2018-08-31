import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Messages } from '../../messages/messages';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  messageClass;
  message;
  processing = false;

  tokenParameter: string;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

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

    let email = this.form.get('email').value;
    let firstPassword = this.form.get('senha1').value;
    let secondPassword = this.form.get('senha2').value;
    console.log(this.tokenParameter);

    if (firstPassword === secondPassword && this.tokenParameter) {
      console.log(this.tokenParameter);

      this.authService.changePassword(this.tokenParameter, email, firstPassword).subscribe(data => {
        this.message = Messages.SUC_FORGOT_CHANGE_PASSWORD;
        this.messageClass = "alert alert-success";

      }, err => {
        this.processing = false;
        this.enableForm();
        this.message = err.error.message;
        this.messageClass = 'alert alert-danger';
      });
    }
    else {
      this.message = "Senhas não coincidem";
      this.messageClass = "alert alert-danger";
    }
  }

  goToLoginPage() {
    // Redirect to home
    this.router.navigate(['/login']);
  }
}
