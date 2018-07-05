import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.css']
})
export class PointFormComponent implements OnInit {

  @Output() techReportForm = new EventEmitter();

  coverEvaluation: FormGroup;
  sowingEvaluation: FormGroup;
  plantEvaluation: FormGroup;
  submitted = false;

  points: Array<any> = [
    {
      line1: ' ',
      line2: ' ',
    },
    {
      line1: ' ',
      line2: '',
    }
  ]

  line1Points: Array<any> = [{ point: '' }, { point: '' }];
  line2Points: Array<any> = [{ point: '' }, { point: '' }];

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
      extraComments: ['', Validators.required],

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
    });

    this.plantEvaluation = this.formBuilder.group({
      propertyName: ['', Validators.required],
      allotment: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      plantStage: ['', Validators.required],
      date: ['', Validators.required],
      totalPlantsIn10Meters: ['', Validators.required],

      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.coverEvaluation.controls; }


  clickInLine1(index) {
    console.log("click in line point ", index);
    if (index == this.line1Points.length - 1)
      this.line1Points.push({ point: '' });

    //console.log(this.points);
  }

  clickInLine2(index) {
    console.log("click in line point ", index);
    if (index == this.line1Points.length - 1)
      this.line1Points.push({ point: '' });

    //console.log(this.points);
  }


  getCoverEvaluationFormData() {
    let data = 
    {
      PropertyName:this.coverEvaluation.controls['propertyName'].value,
      ClientName:this.coverEvaluation.controls['clientName'].value,
      Allotment:this.coverEvaluation.controls['allotment'].value,
      PointNumber:this.coverEvaluation.controls['pointNumber'].value,
      Latitude:this.coverEvaluation.controls['latitude'].value,
      Longitude:this.coverEvaluation.controls['longitude'].value,
      SoilAnalysis:this.coverEvaluation.controls['soilAnalysis'].value,
      Compaction:this.coverEvaluation.controls['compaction'].value,
      EvaluationType:this.coverEvaluation.controls['evaluationType'].value,
      Date:this.coverEvaluation.controls['date'].value,
      Material:this.coverEvaluation.controls['material'].value,
      Weight:this.coverEvaluation.controls['weight'].value,
      ExtraComments:this.coverEvaluation.controls['extraComments'].value     
    }

    return data;
  }

  getSowingEvaluationFormData() {

    let data = {
      
      SoilHumidity:this.sowingEvaluation.controls['soilHumidity'].value,
      Desiccation:this.sowingEvaluation.controls['desiccation'].value,
      ExtraComments:this.sowingEvaluation.controls['extraComments'].value,
      SowingData:this.sowingEvaluation.controls['sowingData'].value,
      Sower:this.sowingEvaluation.controls['sower'].value,
      Depth:this.sowingEvaluation.controls['depth'].value,
      Spacing:this.sowingEvaluation.controls['spacing'].value,
      Cultivation:this.sowingEvaluation.controls['cultivation'].value,
      Germination:this.sowingEvaluation.controls['germination'].value,
      TotalSeedsIn4Meters:this.sowingEvaluation.controls['totalSeedsIn4Meters'].value,
      ExtraComments2:this.sowingEvaluation.controls['extraComments2'].value,

    }    

    return data;
  }

  getPlantEvaluationFormData() {

    let data = {
      
      PropertyName:this.plantEvaluation.controls['propertyName'].value,
      Allotment:this.plantEvaluation.controls['allotment'].value,
      Latitude:this.plantEvaluation.controls['latitude'].value,
      Longitude:this.plantEvaluation.controls['longitude'].value,
      PlantStage:this.plantEvaluation.controls['plantStage'].value,
      Date:this.plantEvaluation.controls['date'].value,
      TotalPlantsIn10Meters:this.plantEvaluation.controls['totalPlantsIn10Meters'].value,
    }    

    return data;
  }

  onRegisterClick() {

    this.techReportForm.emit({"CoverEvaluation":this.getCoverEvaluationFormData(), 
                              "SowingEvaluation":this.getSowingEvaluationFormData(), 
                              "PlantEvaluation":this.getPlantEvaluationFormData() });
  }
}
