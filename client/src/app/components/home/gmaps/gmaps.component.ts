import { Component, ViewChild, OnInit, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { } from '@types/googlemaps';
import {NguiMap,  DataLayer, DrawingManager} from '@ngui/map';

import { PropertyService } from '../../../services/property.service';
import { zip } from 'rxjs';


@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.component.html',
  styleUrls: ['./gmaps.component.css']
})
export class GmapsComponent implements OnInit {
  
  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  @ViewChild(DataLayer) dataLayer: DataLayer;
  selectedOverlay: any;
  @ViewChild('search') public searchElement: ElementRef;
  @ViewChild('gmap') public gmap: ElementRef;
  area;
  autocomplete: google.maps.places.Autocomplete;
  address: any = {};

  mapProps: any = {
    center: 'Recife',
    zoom: 12,
    drawingMode: '',
  };

  geoJsonObject: any;
  currentMap:any;

  constructor(public propertyService: PropertyService, private ref: ChangeDetectorRef) { }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  styleFunc(feature) {
    return {
      fillColor: feature.properties.color.toString(),
      strokeWeight: 1
    };
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

    this.mapProps.center = new google.maps.LatLng(la, lb);
    this.ref.detectChanges();
  }

  ngOnInit() {

    // var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-34.87013339996337,-8.048734091115579],[-34.889960289001465,-8.049498957184937],[-34.887986183166504,-8.071934385576592],[-34.87013339996337,-8.048734091115579]]]}}]}';
    var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-34.87013339996337,-8.048734091115579],[-34.889960289001465,-8.049498957184937],[-34.887986183166504,-8.071934385576592],[-34.87013339996337,-8.048734091115579]]]}},{"type":"Feature","properties":{"stroke":"#555555","stroke-width":0,"stroke-opacity":1,"fill":"#238741","fill-opacity":1},"geometry":{"type":"Polygon","coordinates":[[[-34.88532543182373,-8.056892588056478],[-34.88064765930175,-8.056892588056478],[-34.88064765930175,-8.052430930406018],[-34.88532543182373,-8.052430930406018],[-34.88532543182373,-8.056892588056478]]]}}]}';

    var geojson = JSON.parse(path);

    this.geoJsonObject = geojson; 

    this.dataLayer['initialized$'].subscribe( dl =>
    {
      var stateLayer = new google.maps.Data();
      stateLayer.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/google.json');
      stateLayer.setStyle(function(feature) {
        var ascii = feature.getProperty('ascii');
        var color = feature.getProperty('color');
        return {
          fillColor: color,
          strokeWeight: 1
        };
      });  
      stateLayer.setMap(dl.map);
    })
    
    this.drawingManager['initialized$'].subscribe(dm => {
 
      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
 
          google.maps.event.addListener(event.overlay, 'click', e => {
            this.selectedOverlay = event.overlay;
            this.selectedOverlay.setEditable(true);
          });
 
          this.selectedOverlay = event.overlay; 
          var areaM2 = google.maps.geometry.spherical.computeArea(this.selectedOverlay.getPath()); 
          this.area = this.SquareMetersToHectare(areaM2) 
          this.mapProps.drawingMode = ''; 
          this.propertyService.addArea(this.area.toString());

          for (let coord of this.selectedOverlay.getPath().getArray()) {
            console.log(coord.lat(), coord.lng());
          }

          // console.log(this.selectedOverlay.getPath());
          // console.log(this.selectedOverlay.getPath().getArray()[0].lat());
        }
      });    
         
    });
  }

  deleteSelectedOverlay() {
    console.log("called");
    if (this.selectedOverlay) {
      this.selectedOverlay.setMap(null);
      delete this.selectedOverlay;   
      this.propertyService.addArea("");  
    }
  }

  SquareMetersToHectare(area: any) : Number {
    return area/10000;
  }

  clickDrawPolygon() {
    this.mapProps.drawingMode = 'polygon';   
  }

  clickMovePolygon() {
    this.mapProps.drawingMode = '';
  }

  clickZoomIn()
  {
    this.currentMap.setZoom(this.currentMap.getZoom() + 1);
    this.ref.detectChanges();

    for (let coord of this.selectedOverlay.getPath().getArray()) {
      console.log(coord.lat(), coord.lng());
    }
  }

  clickZoomOut()
  {
    this.currentMap.setZoom(this.currentMap.getZoom() - 1);
    this.ref.detectChanges();
  }

  clicked(event)
  {
    console.log(event);
  }

  onMapReady(event)
  {
    this.currentMap = event;

    console.log(this.currentMap);
  }
}
