import { Component, ViewChild, OnInit, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { } from '@types/googlemaps';
import { DrawingManager } from '@ngui/map';

@Component({
  selector: 'app-home',
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private ref: ChangeDetectorRef) { }

  initialized(autocomplete: any) {

  }

  placeChanged() {
    
   
  }

  ngOnInit() {

  }


}
