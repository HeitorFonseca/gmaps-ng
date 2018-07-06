import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TechReport } from './../../../../models/techReport'

@Component({
  selector: 'app-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.css']
})

export class PointFormComponent implements OnInit, OnChanges {

  @Input() currentReport;
  @Output() techReportForm = new EventEmitter();

  techReport: TechReport = new TechReport();

  setCurrentReport:boolean = false;

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

  Linea1: [{P1: string,P2: string}];

  Linea2: [{P1: string,P2: string}];

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

    if (this.currentReport) 
    {
      this.setCoverEvaluationFormData(this.currentReport);
      this.setSowingEvaluationFormData(this.currentReport);
      this.setPlantEvaluationFormData(this.currentReport);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes:", changes);
    if (changes['currentReport']) {
      let varChange = changes['analyses'];
      if (varChange) {
        this.currentReport = varChange.currentValue;
        this.setCoverEvaluationFormData(this.currentReport);
        this.setSowingEvaluationFormData(this.currentReport);
        this.setPlantEvaluationFormData(this.currentReport);
      }
    }
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

  setCoverEvaluationFormData(techReport: TechReport)
  {
    this.coverEvaluation.setValue({
      propertyName: techReport.CoverEvaluation.PropertyName,
      clientName: techReport.CoverEvaluation.ClientName,
      allotment: techReport.CoverEvaluation.Allotment,
      pointNumber: techReport.CoverEvaluation.PointNumber,
      latitude: techReport.CoverEvaluation.Latitude,
      longitude: techReport.CoverEvaluation.Longitude,
      soilAnalysis: techReport.CoverEvaluation.SoilAnalysis,
      compaction: techReport.CoverEvaluation.Compaction,
      evaluationType: techReport.CoverEvaluation.EvaluationType,
      date: techReport.CoverEvaluation.Date,
      material: techReport.CoverEvaluation.Material,
      weight: techReport.CoverEvaluation.Weight,
      extraComments: techReport.CoverEvaluation.ExtraComments
    })
  }

  getCoverEvaluationFormData() {
    this.techReport.CoverEvaluation =
      {
        PropertyName: this.coverEvaluation.controls['propertyName'].value,
        ClientName: this.coverEvaluation.controls['clientName'].value,
        Allotment: this.coverEvaluation.controls['allotment'].value,
        PointNumber: this.coverEvaluation.controls['pointNumber'].value,
        Latitude: this.coverEvaluation.controls['latitude'].value,
        Longitude: this.coverEvaluation.controls['longitude'].value,
        SoilAnalysis: this.coverEvaluation.controls['soilAnalysis'].value,
        Compaction: this.coverEvaluation.controls['compaction'].value,
        EvaluationType: this.coverEvaluation.controls['evaluationType'].value,
        Date: this.coverEvaluation.controls['date'].value,
        Material: this.coverEvaluation.controls['material'].value,
        Weight: this.coverEvaluation.controls['weight'].value,
        ExtraComments: this.coverEvaluation.controls['extraComments'].value
      }
  }

  setSowingEvaluationFormData(techReport:TechReport) {

    this.sowingEvaluation.setValue({
      soilHumidity: techReport.SowingEvaluation.SoilHumidity,
      desiccation: techReport.SowingEvaluation.Desiccation,
      extraComments: techReport.SowingEvaluation.ExtraComments,
      sowingData: techReport.SowingEvaluation.SowingData,
      sower: techReport.SowingEvaluation.Sower,
      depth: techReport.SowingEvaluation.Depth,
      spacing: techReport.SowingEvaluation.Spacing,
      cultivation: techReport.SowingEvaluation.Cultivation,
      germination: techReport.SowingEvaluation.Germination,
      totalSeedsIn4Meters: techReport.SowingEvaluation.TotalSeedsIn4Meters,
      extraComments2: techReport.SowingEvaluation.ExtraComments2,
    });

  }

  getSowingEvaluationFormData() {

    this.techReport.SowingEvaluation =
     {
        
      SoilHumidity: this.sowingEvaluation.controls['soilHumidity'].value.toString(),
      Desiccation: this.sowingEvaluation.controls['desiccation'].value,
      ExtraComments: this.sowingEvaluation.controls['extraComments'].value,
      SowingData: this.sowingEvaluation.controls['sowingData'].value,
      Sower: this.sowingEvaluation.controls['sower'].value,
      Depth: this.sowingEvaluation.controls['depth'].value,
      Spacing: this.sowingEvaluation.controls['spacing'].value,
      Cultivation: this.sowingEvaluation.controls['cultivation'].value,
      Germination: this.sowingEvaluation.controls['germination'].value,
      SeedDistribution: {
        Linea1: this.Linea1,
        Linea2: this.Linea2
      },
      TotalSeedsIn4Meters: this.sowingEvaluation.controls['totalSeedsIn4Meters'].value,
      ExtraComments2: this.sowingEvaluation.controls['extraComments2'].value,

    }

  }

  setPlantEvaluationFormData(techReport:TechReport) {

    this.plantEvaluation.setValue({
      propertyName: techReport.PlantEvaluation.PropertyName,
      allotment: techReport.PlantEvaluation.Allotment,
      latitude: techReport.PlantEvaluation.Latitude,
      longitude: techReport.PlantEvaluation.Longitude,
      plantStage: techReport.PlantEvaluation.PlantStage,
      date: techReport.PlantEvaluation.Date,
      totalPlantsIn10Meters: techReport.PlantEvaluation.TotalPlantsIn10Meters,     
    });
  }

  getPlantEvaluationFormData() {

    this.techReport.PlantEvaluation = {

      PropertyName: this.plantEvaluation.controls['propertyName'].value,
      Allotment: this.plantEvaluation.controls['allotment'].value,
      Latitude: this.plantEvaluation.controls['latitude'].value,
      Longitude: this.plantEvaluation.controls['longitude'].value,
      PlantStage: this.plantEvaluation.controls['plantStage'].value,
      Date: this.plantEvaluation.controls['date'].value,
      PlantDistribution: {
        Linea1: this.Linea1,
        Linea2: this.Linea2
      },
      TotalPlantsIn10Meters: this.plantEvaluation.controls['totalPlantsIn10Meters'].value,
    }
  }

  onRegisterClick() {

    this.getCoverEvaluationFormData();
    this.getSowingEvaluationFormData();
    this.getPlantEvaluationFormData();
    this.techReportForm.emit(this.techReport);
  }
}
