import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PropertyService } from '../../../services/property.service';
import { Property } from '../../../models/property';

import { Data } from '../../../providers/data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  propeties: any;

  constructor(public propertyService: PropertyService, private propData:Data,
              private router: Router) { }

  ngOnInit() {
    this.propertyService.getProperties().subscribe ( data => {
      this.propeties = data;
      console.log(this.propeties);
      this.propData.propertyData = this.propeties;

    });
  }

  selectProperty(propertyName:any) {
    console.log("propertyName:", propertyName);
    this.router.navigate(['/propertyDetails', propertyName]);

  }

}
