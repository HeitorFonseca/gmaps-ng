import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../../services/property.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-property-area',
  templateUrl: './property-area.component.html',
  styleUrls: ['./property-area.component.css']
})
export class PropertyAreaComponent implements OnInit {

  model: any;
  area: string = "";
  form: FormGroup;

  checkBoxBtn = {
    NDVI: true,
    NDWI: true, 
    Produtividade: true
  };

  constructor(public propertyService: PropertyService, private formBuilder: FormBuilder) {
    this.createForm();
   }

  ngOnInit() {
    this.propertyService.propertyAreaSubject.subscribe(
      data => this.area = data
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

  deleteSelectedOverlay(data)
  {
    console.log("123123");
    this.propertyService.cancelPolygon();
  }
}
