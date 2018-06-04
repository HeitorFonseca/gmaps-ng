import { Component, ViewChild, OnInit, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { } from '@types/googlemaps';
import { DataLayer, DrawingManager } from '@ngui/map';

import { PropertyService } from '../../../services/property.service';


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
    zoom: 11,
    drawingMode: ''
  };

  colors:any = {
    fillColor:'FF0000'
  }

  test: any;

  geoJsonObject: any;
  constructor(public propertyService: PropertyService, private ref: ChangeDetectorRef) { }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  styleFunc(feature) {
    console.log("dasdasdas");
        return ({
          fillColor: 'red',
          strokeWeight: 1
        });
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

    console.log(this.mapProps);

    this.ref.detectChanges();
  }

  ngOnInit() {

    // var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-34.87013339996337,-8.048734091115579],[-34.889960289001465,-8.049498957184937],[-34.887986183166504,-8.071934385576592],[-34.87013339996337,-8.048734091115579]]]}}]}';
    var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-34.87013339996337,-8.048734091115579],[-34.889960289001465,-8.049498957184937],[-34.887986183166504,-8.071934385576592],[-34.87013339996337,-8.048734091115579]]]}},{"type":"Feature","properties":{"stroke":"#555555","stroke-width":0,"stroke-opacity":1,"fill":"#238741","fill-opacity":1},"geometry":{"type":"Polygon","coordinates":[[[-34.88532543182373,-8.056892588056478],[-34.88064765930175,-8.056892588056478],[-34.88064765930175,-8.052430930406018],[-34.88532543182373,-8.052430930406018],[-34.88532543182373,-8.056892588056478]]]}}]}';

    var geojson = JSON.parse(path);

    this.test = geojson;

    this.geoJsonObject = null;

    this.propertyService.deleteSelectedOverlay.subscribe(
      data => this.deleteSelectedOverlay()
    );    

    // this.dataLayer['initialized$'].subscribe(dl => {
    //   console.log(dl);
    // });

    
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

          console.log(this.selectedOverlay.getPath());

          this.propertyService.addArea(this.area.toString());
        } 
      });     
      
      var triangleCoords = [
        {lat: 25.774, lng: -80.190},
        {lat: 0.466, lng: -66.118},
        {lat: 32.321, lng: -64.757},
        {lat: 25.774, lng: -80.190}
    ];
      // Construct the polygon.
      var bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
      bermudaTriangle.setMap(this.gmap.nativeElement);

      console.log(bermudaTriangle);
    });

    var geoJsonObject2: Object = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "letter": "G",
            "color": "blue",
            "rank": "7",
            "ascii": "71"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [123.61, -22.14], [122.38, -21.73], [121.06, -21.69], [119.66, -22.22], [119.00, -23.40],
                [118.65, -24.76], [118.43, -26.07], [118.78, -27.56], [119.22, -28.57], [120.23, -29.49],
                [121.77, -29.87], [123.57, -29.64], [124.45, -29.03], [124.71, -27.95], [124.80, -26.70],
                [124.80, -25.60], [123.61, -25.64], [122.56, -25.64], [121.72, -25.72], [121.81, -26.62],
                [121.86, -26.98], [122.60, -26.90], [123.57, -27.05], [123.57, -27.68], [123.35, -28.18],
                [122.51, -28.38], [121.77, -28.26], [121.02, -27.91], [120.49, -27.21], [120.14, -26.50],
                [120.10, -25.64], [120.27, -24.52], [120.67, -23.68], [121.72, -23.32], [122.43, -23.48],
                [123.04, -24.04], [124.54, -24.28], [124.58, -23.20], [123.61, -22.14]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "letter": "o",
            "color": "red",
            "rank": "15",
            "ascii": "111"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [128.84, -25.76], [128.18, -25.60], [127.96, -25.52], [127.88, -25.52], [127.70, -25.60],
                [127.26, -25.79], [126.60, -26.11], [126.16, -26.78], [126.12, -27.68], [126.21, -28.42],
                [126.69, -29.49], [127.74, -29.80], [128.80, -29.72], [129.41, -29.03], [129.72, -27.95],
                [129.68, -27.21], [129.33, -26.23], [128.84, -25.76]
              ],
              [
                [128.45, -27.44], [128.32, -26.94], [127.70, -26.82], [127.35, -27.05], [127.17, -27.80],
                [127.57, -28.22], [128.10, -28.42], [128.49, -27.80], [128.45, -27.44]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "letter": "o",
            "color": "yellow",
            "rank": "15",
            "ascii": "111"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [131.87, -25.76], [131.35, -26.07], [130.95, -26.78], [130.82, -27.64], [130.86, -28.53],
                [131.26, -29.22], [131.92, -29.76], [132.45, -29.87], [133.06, -29.76], [133.72, -29.34],
                [134.07, -28.80], [134.20, -27.91], [134.07, -27.21], [133.81, -26.31], [133.37, -25.83],
                [132.71, -25.64], [131.87, -25.76]
              ],
              [
                [133.15, -27.17], [132.71, -26.86], [132.09, -26.90], [131.74, -27.56], [131.79, -28.26],
                [132.36, -28.45], [132.93, -28.34], [133.15, -27.76], [133.15, -27.17]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "letter": "g",
            "color": "blue",
            "rank": "7",
            "ascii": "103"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [138.12, -25.04], [136.84, -25.16], [135.96, -25.36], [135.26, -25.99], [135, -26.90],
                [135.04, -27.91], [135.26, -28.88], [136.05, -29.45], [137.02, -29.49], [137.81, -29.49],
                [137.94, -29.99], [137.90, -31.20], [137.85, -32.24], [136.88, -32.69], [136.45, -32.36],
                [136.27, -31.80], [134.95, -31.84], [135.17, -32.99], [135.52, -33.43], [136.14, -33.76],
                [137.06, -33.83], [138.12, -33.65], [138.86, -33.21], [139.30, -32.28], [139.30, -31.24],
                [139.30, -30.14], [139.21, -28.96], [139.17, -28.22], [139.08, -27.41], [139.08, -26.47],
                [138.99, -25.40], [138.73, -25.00], [138.12, -25.04]
              ],
              [
                [137.50, -26.54], [136.97, -26.47], [136.49, -26.58], [136.31, -27.13], [136.31, -27.72],
                [136.58, -27.99], [137.50, -28.03], [137.68, -27.68], [137.59, -26.78], [137.50, -26.54]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "letter": "l",
            "color": "green",
            "rank": "12",
            "ascii": "108"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [140.14, -21.04], [140.31, -29.42], [141.67, -29.49], [141.59, -20.92], [140.14, -21.04]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "letter": "e",
            "color": "red",
            "rank": "5",
            "ascii": "101"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [144.14, -27.41], [145.67, -27.52], [146.86, -27.09], [146.82, -25.64], [146.25, -25.04],
                [145.45, -24.68], [144.66, -24.60], [144.09, -24.76], [143.43, -25.08], [142.99, -25.40],
                [142.64, -26.03], [142.64, -27.05], [142.64, -28.26], [143.30, -29.11], [144.18, -29.57],
                [145.41, -29.64], [146.46, -29.19], [146.64, -28.72], [146.82, -28.14], [144.84, -28.42],
                [144.31, -28.26], [144.14, -27.41]
              ],
              [
                [144.18, -26.39], [144.53, -26.58], [145.19, -26.62], [145.72, -26.35], [145.81, -25.91],
                [145.41, -25.68], [144.97, -25.68], [144.49, -25.64], [144, -25.99], [144.18, -26.39]
              ]
            ]
          }
        }
      ]
    };
   
    // this.geoJsonObject = geoJsonObject2;
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
    this.geoJsonObject = this.test;
  }

  clicked(event)
  {
    console.log(event);
  }
}
