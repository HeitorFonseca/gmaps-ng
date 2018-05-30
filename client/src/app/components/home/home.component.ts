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
    
    let place = this.autocomplete.getPlace();
    console.log(place);
    
    if (place.geometry === undefined || place.geometry === null) {
      return;
    }

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }

    let la = place.geometry.location.lat();
    let lb =  place.geometry.location.lng();

    //this.gmap.nativeElement.setCenter(place.geometry.location.lat(), place.geometry.location.lng());

    this.mapProps.center = new google.maps.LatLng(la, lb);

    console.log(this.mapProps);

    this.ref.detectChanges();
  }

  ngOnInit() {

    console.log("this.searchElement");
    
    this.drawingManager['initialized$'].subscribe(dm => {

      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          dm.setDrawingMode(null);

          google.maps.event.addListener(event.overlay, 'click', e => {
            this.selectedOverlay = event.overlay;
            this.selectedOverlay.setEditable(true);
          });

          this.selectedOverlay = event.overlay;
          this.selectedOverlay.type = event.type;

          var area = google.maps.geometry.spherical.computeArea(this.selectedOverlay.getPath());

          this.areaText = this.SquareMetersToHectare(area).toString();
        } 
      });      
    });

  }

  deleteSelectedOverlay() {
    if (this.selectedOverlay) {
      this.selectedOverlay.setMap(null);
      delete this.selectedOverlay;
      this.areaText = "";
    }
  }

  SquareMetersToHectare(area: any) : Number
  {
    return area/10000;
  }

}
