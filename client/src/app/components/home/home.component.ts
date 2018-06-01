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

  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  areaText: string = "";
  selectedOverlay: any;
  @ViewChild('search') public searchElement: ElementRef;
  @ViewChild('gmap') public gmap: ElementRef;

  autocomplete: google.maps.places.Autocomplete;
  address: any = {};

  mapProps: any = {
    center: 'Recife',
    zoom: 11
  };

  constructor(private ref: ChangeDetectorRef) { }

  initialized(autocomplete: any) {
    console.log(autocomplete);
    this.autocomplete = autocomplete;
  }

  placeChanged() {
    
   
  }

  ngOnInit() {

  }


}
