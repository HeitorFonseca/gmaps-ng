import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, Form } from '@angular/forms';

import { PropertyService } from '../../../../services/property.service';
import { Property, AreasOverlay } from '../../../../models/property';

@Component({
  selector: 'app-property-area',
  templateUrl: './property-area.component.html',
  styleUrls: ['./property-area.component.css']
})
export class PropertyAreaComponent implements OnInit {

  property: Property = new Property();
  model: any;
  area: string = "";
  form: FormGroup;
  areas =  new FormArray([]);
  processing;

  checkBoxBtn = {
    NDVI: true,
    NDWI: true, 
    Produtividade: true
  };

  constructor(public propertyService: PropertyService, private formBuilder: FormBuilder) {
    this.createForm();
   }

  ngOnInit() {
    this.processing = false;


    this.propertyService.propertyAreaSubject.subscribe(
      data => this.fillPropertyArea(data)
    );   

  }

  createForm()
  {
    this.form = this.formBuilder.group({
      propertyName: ['', Validators.required],
      areaName: ['', Validators.required],
      havestType: ['', Validators.required],
      date: ['', Validators.required],
      propertyArea: ['', Validators.required]
    });
  }

  onResetClick() {
    console.log("asdasdasdas");
    this.propertyService.cancelPolygon(this.areas.length);
  }

  addProperty() {
    this.processing = true;
    
    let dt = this.form.controls['date'].value;

    this.property.AreasOverlay[this.property.AreasOverlay.length-1].HarvestDate = dt.day + "/" + dt.month + "/" + dt.year;

    this.property.Area = this.form.controls['propertyArea'].value
    this.property.PropertyName = this.form.controls['propertyName'].value
    
    this.areas.push(this.form);
    var objStr = JSON.stringify({"id":this.areas.length-1, "areaName": this.form.controls['areaName'].value})
    this.propertyService.addAreaName(objStr);

    this.property.AreasOverlay[this.property.AreasOverlay.length-1].AreaName = this.form.controls['areaName'].value;
    this.createForm();

    console.log(this.areas);

    this.processing = false;

  }

  registerProperty() {
    console.log("register property", this.property);
    this.propertyService.registerProperty(this.property).subscribe(data => {
      console.log(data);
    });
  }

  fillPropertyArea(data:AreasOverlay) {    
    this.form.get('propertyArea').setValue(data.AreaName);
    this.property.AreasOverlay.push(data);
  }
}