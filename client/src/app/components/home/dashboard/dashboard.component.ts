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
  geolocationPosition: any;
  location: any;

  constructor(public propertyService: PropertyService, 
              private propData: Data,
              private router: Router) { }

  ngOnInit() {

    let usr = JSON.parse(localStorage.getItem('user'));

    if (usr.roles[0] == "ADMIN") {
      this.propertyService.getPropertiesByUser(usr.OwnerId).subscribe(data => {
        this.propeties = data;
        console.log(this.propeties);
        this.propData.propertyData = this.propeties;

      });
    }

    this.getClientLocalization();
  }


  selectProperty(propertyName: any) {
    console.log("propertyName:", propertyName);
    this.router.navigate(['/propertyDetails', propertyName]);

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
