import { Component, ViewChild, OnInit, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { } from '@types/googlemaps';
import { NguiMap, DataLayer, DrawingManager, NguiMapComponent } from '@ngui/map';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PropertyService } from '../../../../services/property.service';
import { zip } from 'rxjs';

import { Property, AreasOverlay } from '../../../../models/property';


@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.component.html',
  styleUrls: ['./gmaps.component.css']
})
export class GmapsComponent implements OnInit {

  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  @ViewChild(DataLayer) dataLayer: DataLayer;
  area;
  areaName: string = '';
  autocomplete: google.maps.places.Autocomplete;
  address: any = {};
  overlayAreas: Array<any> = new Array<any>();
  makerLabels: Array<any> = new Array<any>();

  coordinate: any = {
    latitude: '',
    longitude: ''
  }

  mapProps: any = {
    center: 'Recife',
    zoom: 12,
    drawingMode: '',
  };

  geoJsonObject: any;
  currentMap: any;

  polygonsCoord: Array<any> = new Array<any>();

  constructor(public propertyService: PropertyService,
    public activeModal: NgbActiveModal,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal) {

    this.propertyService.propertyAreaNameSubject.subscribe(
      data => this.addAreaName(data)
    );

    this.propertyService.deleteSelectedOverlay.subscribe(
      data => this.deleteSelectedOverlay(+data)
    );

    this.propertyService.drawPolygons.subscribe(
      data => {
        this.drawPolygons(data)
      }
    );

  }

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
    let lb = place.geometry.location.lng();

    this.mapProps.center = new google.maps.LatLng(la, lb);
    this.ref.detectChanges();
  }

  ngOnInit() {

    // var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-34.87013339996337,-8.048734091115579],[-34.889960289001465,-8.049498957184937],[-34.887986183166504,-8.071934385576592],[-34.87013339996337,-8.048734091115579]]]}}]}';
    var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-34.87013339996337,-8.048734091115579],[-34.889960289001465,-8.049498957184937],[-34.887986183166504,-8.071934385576592],[-34.87013339996337,-8.048734091115579]]]}},{"type":"Feature","properties":{"stroke":"#555555","stroke-width":0,"stroke-opacity":1,"fill":"#238741","fill-opacity":1},"geometry":{"type":"Polygon","coordinates":[[[-34.88532543182373,-8.056892588056478],[-34.88064765930175,-8.056892588056478],[-34.88064765930175,-8.052430930406018],[-34.88532543182373,-8.052430930406018],[-34.88532543182373,-8.056892588056478]]]}}]}';

    var geojson = JSON.parse(path);

    this.geoJsonObject = geojson;

    // this.dataLayer['initialized$'].subscribe(dl =>
    // {
    //   var stateLayer = new google.maps.Data();
    //   stateLayer.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/google.json');
    //   stateLayer.setStyle(function(feature) {
    //     var ascii = feature.getProperty('ascii');
    //     var color = feature.getProperty('color');
    //     return {
    //       fillColor: color,
    //       strokeWeight: 1
    //     };
    //   });  
    //   stateLayer.setMap(dl.map);
    // })

    this.drawingManager['initialized$'].subscribe(dm => {

      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {


          var overlay: any;
          google.maps.event.addListener(event.overlay, 'click', e => {
            overlay = event.overlay;
            overlay.setEditable(true);
          });

          overlay = event.overlay;
          var areaM2 = google.maps.geometry.spherical.computeArea(overlay.getPath());
          this.area = this.SquareMetersToHectare(areaM2)
          this.mapProps.drawingMode = '';

          var areasOverlay: AreasOverlay = new AreasOverlay;

          areasOverlay.AreaName = this.area.toString();

          let array = overlay.getPath().getArray();

          for (let coord of overlay.getPath().getArray()) {
            let lat = coord.lat();
            let lng = coord.lng();
            areasOverlay.Lats.push(lat.toString());
            areasOverlay.Lngs.push(lng.toString());
          }

          this.propertyService.addArea(areasOverlay);

          this.overlayAreas.push(overlay);
          console.log(this.overlayAreas);
        }
      });

    });
  }

  deleteSelectedOverlay(id: number) {
    console.log("called ", id, " ", this.overlayAreas);
    if (this.overlayAreas[id]) {
      this.overlayAreas[id].setMap(null);
      // delete this.overlayAreas[id];
      this.overlayAreas.splice(id);
      this.propertyService.addArea("");

      //this.makerLabels[id].setMap(null);
    }
    else {
      console.log("error in delete selected overlay");
    }
  }

  addAreaName(areaField) {
    var obj = JSON.parse(areaField);

    if (this.overlayAreas[obj.id]) {

      var bounds = new google.maps.LatLngBounds();

      for (let coord of this.overlayAreas[obj.id].getPath().getArray()) {
        bounds.extend(coord);
      }

      var marker = new google.maps.Marker({
        position: bounds.getCenter(),
        map: this.currentMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0
        },
        label: {
          text: obj.areaName,
          color: 'white',
        }
      });

      this.makerLabels.push(marker);
    }
  }

  SquareMetersToHectare(area: any): Number {
    return area / 10000;
  }

  clickDrawPolygon() {
    this.mapProps.drawingMode = 'polygon';
  }

  clickMovePolygon() {
    this.mapProps.drawingMode = '';
  }

  clickZoomIn() {
    this.currentMap.setZoom(this.currentMap.getZoom() + 1);
    this.ref.detectChanges();
  }

  clickZoomOut() {
    this.currentMap.setZoom(this.currentMap.getZoom() - 1);
    this.ref.detectChanges();
  }

  clicked(event) {
    console.log(event);
  }

  onMapReady(event) {
    this.currentMap = event;

    for (let coord of this.polygonsCoord) {
      this.addPolygons(coord);
    }
  }

  drawPolygons(data) {

    var prop: Property = data;

    if (this.currentMap) {
      this.addPolygons(prop);
    } else {
      this.polygonsCoord.push(prop);
    }

  }

  addPolygons(propert: Property) {

    var globalBounds = new google.maps.LatLngBounds();
    for (let areas of propert.AreasOverlay) {

      var bounds = new google.maps.LatLngBounds();
      var coords = new Array<any>();

      for (let i = 0; i < areas.Lats.length; i++) {
        bounds.extend(new google.maps.LatLng(+areas.Lats[i], +areas.Lngs[i]));
        globalBounds.extend(new google.maps.LatLng(+areas.Lats[i], +areas.Lngs[i]));
        coords.push({ lat: +areas.Lats[i], lng: +areas.Lngs[i] });
      }

      var bermudaTriangle = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });

      bermudaTriangle.setMap(this.currentMap);

      var marker = new google.maps.Marker({
        position: bounds.getCenter(),
        map: this.currentMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0
        },
        label: {
          text: areas.AreaName,
          color: 'white',
        }
      });

      this.makerLabels.push(marker);
    }

    console.log("blobal:",globalBounds);
    this.mapProps.center = new google.maps.LatLng(globalBounds.getCenter().lat(), globalBounds.getCenter().lng());
    this.mapProps.zoom = 17;

  }

  /*********************************************** Modal functions ***********************************************/

  openCoordsModal(modal) {
    console.log(modal);
    this.activeModal = this.modalService.open(modal);
  }

  locate() {
    console.log(this.coordinate);
    if (this.coordinate.longitude != '' && this.coordinate.latitude != '') {
      this.mapProps.center = new google.maps.LatLng(this.coordinate.latitude, this.coordinate.longitude);
    }
    this.activeModal.dismiss();
  }
}
