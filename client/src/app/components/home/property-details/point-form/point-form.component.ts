import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.css']
})
export class PointFormComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {

    this.registerForm = this.formBuilder.group({
      propertyName: ['', Validators.required],
      clientName: ['', Validators.required],
      allotment: ['', Validators.required],
      pointNumber: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],           
      soilAnalysis: ['', Validators.required],     
      compaction: ['', Validators.required],     
      evaluationType: ['', Validators.required],     
      date: ['', Validators.required],     
      material: ['', Validators.required],     
      weight: ['', Validators.required],     
      soilHumidity: ['', Validators.required],     
      desiccation: ['', Validators.required],     
      extraComments: ['', Validators.required],     
      sowingData: ['', Validators.required],     
      sower: ['', Validators.required],     
      depth: ['', Validators.required],     
      spacing: ['', Validators.required],     
      cultivation: ['', Validators.required],     
      germination: ['', Validators.required],     

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });

   }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
}
