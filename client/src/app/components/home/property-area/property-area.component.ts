import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-property-area',
  templateUrl: './property-area.component.html',
  styleUrls: ['./property-area.component.css']
})
export class PropertyAreaComponent implements OnInit {

  model: any;
  area: string = "";

  checkBoxBtn = {
    NDVI: true,
    NDWI: true,
    Produtividade: true
  };

  constructor(public propertyService: PropertyService) { }

  ngOnInit() {
    this.propertyService.propertyAreaSubject.subscribe(
      data => this.area = data
    );
  }

  deleteSelectedOverlay(data)
  {
    console.log("123123");
    this.propertyService.cancelPolygon();
  }
}
