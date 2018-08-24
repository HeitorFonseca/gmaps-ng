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

  propeties: Array<Property>;
  geolocationPosition: any;
  location: any;

  constructor(public propertyService: PropertyService, 
              private propData: Data,
              private router: Router) { }

  ngOnInit() {

    this.getClientLocalization();

    let usr = JSON.parse(localStorage.getItem('user'));
    console.log("tipo:", usr.tipo);
    
    this.propertyService.getProperties().subscribe(data => {
          this.propeties = data as Array<Property>;
          this.propData.propertyData = this.propeties;
          console.log("get properties", data);
    }, err => {
      //TODO: Error message
      console.log(err.error.message);
    });

  }

  selectProperty(id: string) {
    console.log("propertyId:", id);
    this.router.navigate(['/propertyDetails', id]);

  }

  getClientLocalization() {

    var _this = this;
    //Dummy one, which will result in a working next statement.
    navigator.geolocation.getCurrentPosition(function () { }, function () { }, {});
    //The working next statement.
    navigator.geolocation.getCurrentPosition(function (position) {
      //Your code here
      console.log("position:", position);
      _this.propData.clientPosition = position;

    }, function (e) {
      //Your error handling here
    }, {
        enableHighAccuracy: true
      });

  }
}
