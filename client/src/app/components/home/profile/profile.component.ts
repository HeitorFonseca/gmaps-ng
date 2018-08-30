import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { UserService } from '../../../services/user.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  formUserData: FormGroup;
  formPassword: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService) {

    this.formUserData = this.formBuilder.group({
      name: [''],
      email: ['']
    });

    this.formPassword = this.formBuilder.group({
      currentPassword: [''],
      newPassword: ['']
    });
  }

  ngOnInit() {

    this.userService.getUser().subscribe(data => {
      console.log("user: ", data);

      this.formUserData.setValue({
        name: data.nome,
        email: data.email
      });
    })
  }

  onChangePasswordClick() {


    let currentPassword = this.formPassword.controls["currentPassword"].value;
    let newPassword = this.formPassword.controls["newPassword"].value;


    this.userService.changePassword(currentPassword, newPassword).subscribe(data => {
      console.log("change password:", data);
    });

  }

}
