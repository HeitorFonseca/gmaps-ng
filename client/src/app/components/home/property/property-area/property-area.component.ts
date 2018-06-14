import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, Form } from '@angular/forms';

import { PropertyService } from '../../../../services/property.service';
import { Property, AreasOverlay } from '../../../../models/property';

@Component({
  selector: 'app-property-area',
  templateUrl: './property-area.component.html',
  styleUrls: ['./property-area.component.css']
})
export class PropertyAreaComponent implements OnInit {

  @Input() prop: Property;

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

  constructor(public propertyService: PropertyService, 
              private formBuilder: FormBuilder) {
    
    this.createForm();
   }

  ngOnInit() {
    this.processing = false;

    this.propertyService.propertyAreaSubject.subscribe(
      data => this.fillPropertyArea(data)
    );   

    if (!this.prop ) {
      console.log("eh nulo");
    }
    else {
      
      this.form.get('propertyName').setValue(this.prop.PropertyName);     
      this.propertyService.addPolygon(this.prop);
        
      console.log("works");
    }

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
    console.log(this.areas.length);
    this.propertyService.cancelPolygon(this.areas.length);
  }

  addProperty() {
    this.processing = true;

    // Property Name
    this.property.PropertyName = this.form.controls['propertyName'].value
    // Area in Hectare
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].Area = this.form.controls['propertyArea'].value
    // Date
    let dt = this.form.controls['date'].value;
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].HarvestDate = dt.day + "/" + dt.month + "/" + dt.year;
    // Harvest Type
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].HarvestType =  this.form.controls['havestType'].value;
    // Area Name
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].AreaName = this.form.controls['areaName'].value;

    console.log("prp", this.property);
    
    this.areas.push(this.form);

    // Add area name in maps
    var objStr = JSON.stringify({"id":this.areas.length-1, "areaName": this.form.controls['areaName'].value})
    this.propertyService.addAreaName(objStr);

    // Reset form
    this.createForm();

    this.processing = false;

  }

  registerProperty() {
    console.log("register property", this.property);
    this.propertyService.registerProperty(this.property).subscribe(data => {
      console.log(data);
    });
  }

  fillPropertyArea(data:AreasOverlay) {   
    let num = new Number(+data.AreaName);

    this.form.get('propertyArea').setValue(num.toPrecision(1));
    this.property.AreasOverlay.push(data);
  }

  
}
