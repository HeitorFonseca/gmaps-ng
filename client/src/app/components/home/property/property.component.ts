import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Property } from '../../../models/property';

import { Data } from './../../../providers/data';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  constructor(private route: ActivatedRoute,  private propData:Data) { }

  property: Property;

  ngOnInit() {
    var propName = this.route.snapshot.paramMap.get('name');

    console.log("propName=",propName);

    if(propName) {
      let properties = this.propData.propertyData;

      console.log(properties);

      for (let prop of properties) {
        if (prop.PropertyName == propName) {
          this.property = prop;
          console.log("achou");
        }
      }      
    }
  }

}
