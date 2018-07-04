import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.css']
})
export class PointFormComponent implements OnInit {

  coverEvaluation: FormGroup;
  sowingEvaluation:FormGroup;
  plantEvaluation:FormGroup;
  submitted = false;

  points:Array<any> = [
    {
      line1: ' ',
      line2: ' ',
    },
    {
      line1: ' ',
      line2: '',
    }
  ] 

  line1Points:Array<any> = [ {point:''}, {point:''}];
  line2Points:Array<any> = [ {point:''}, {point:''}];

  constructor(private formBuilder: FormBuilder) {

    this.coverEvaluation = this.formBuilder.group({
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
      
  });

  this.sowingEvaluation = this.formBuilder.group({    
    soilHumidity: ['', Validators.required],     
    desiccation: ['', Validators.required],     
    extraComments: ['', Validators.required],     
    sowingData: ['', Validators.required],     
    sower: ['', Validators.required],     
    depth: ['', Validators.required],     
    spacing: ['', Validators.required],     
    cultivation: ['', Validators.required],     
    germination: ['', Validators.required],     
    totalSeedsIn4Meters: ['', Validators.required],     
    extraComments2: ['', Validators.required],     

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  this.plantEvaluation = this.formBuilder.group({ 
    propertyName: ['', Validators.required],  
    allotment: ['', Validators.required],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required],  
    plantStage: ['', Validators.required],     
    date: ['', Validators.required],     
    totalPlantsIn10Meters: ['', Validators.required],     

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.coverEvaluation.controls; }


  clickInLine1(index) {
    console.log("click in line point ", index);
    if (index == this.line1Points.length - 1)
      this.line1Points.push({point:''});

    console.log(this.points);

  }

  clickInLine2(index) {
    console.log("click in line point ", index);
    if (index == this.line1Points.length - 1)
      this.line1Points.push({point:''});

    console.log(this.points);
  }
}
