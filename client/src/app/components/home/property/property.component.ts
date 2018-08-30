import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { } from '@types/googlemaps';
import { NguiMap, DataLayer, DrawingManager, NguiMapComponent } from '@ngui/map';
import { zip } from 'rxjs';

import { Messages } from '../../../messages/messages';
import { PropertyService } from '../../../services/property.service';
import { Property, Area } from '../../../models/property';

import { Data } from './../../../providers/data';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  /*********************************************** Variable Declarations ***********************************************/

  @ViewChild(DrawingManager) drawingManager: DrawingManager;

  property: Property;

  propIdParameter: string;
  makerLabels: Array<any> = new Array<any>();
  overlayAreas: Array<any> = new Array<any>();
  polygonsCoord: Array<any> = new Array<any>();

  currentMap: any;

  coordinate: any = {
    latitude: '',
    longitude: ''
  }

  mapProps: any = {
    center: 'Recife',
    zoom: 12,
    drawingMode: '',
  };

  autocomplete: google.maps.places.Autocomplete;
  address: any = {};

  form: FormGroup;
  processingAdd;
  processingCancel;

  /* auxiliar */
  // drawnArea:any;
  message: string;
  messageClass;

  checkBoxBtn = {
    NDVI: true,
    NDWI: true,
    Produtividade: true
  };



  /*********************************************** Variable Declarations ***********************************************/

  areas: Array<Area> = new Array<Area>();;
  selectedArea: Area;

  /* auxiliar */
  drawnArea: Area;

  constructor(private route: ActivatedRoute,
    private propData: Data,
    private propertyService: PropertyService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
    // Create Form
    this.createForm();

    // Get property name from router parameter
    this.propIdParameter = this.route.snapshot.paramMap.get('name');

    console.log("propId=", this.propIdParameter);

    // If has a property name is because the user is editing the property
    if (this.propIdParameter) {

      // Request all property
      this.propertyService.getPropertyById(this.propIdParameter).subscribe(data => {
        console.log("properties:", data);

        this.property = data;                                             // Save the property
        this.form.get('propertyName').setValue(this.property.nome);       // Set property name     

        this.propertyService.getAreasByProperty(this.property.id).subscribe(data => {
          console.log("areas:", data);
          this.areas = data as Array<Area>;
          this.drawPolygons(this.areas);
        });

      });

    } else {
      this.property = new Property();
    }
  }

  ngOnInit() {

    this.processingCancel = true;

    this.drawingManager['initialized$'].subscribe(dm => {

      var polyline = new google.maps.Polyline({
        editable: true
      });

      dm.setOptions({ polylineOptions: polyline });

      console.log("dm:", dm);

      // Add listener for when user draw a polygon
      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {

          var overlay: any;
          google.maps.event.addListener(event.overlay, 'click', e => {
            overlay = event.overlay;
            overlay.setEditable(true);
          });

          overlay = event.overlay;
          var self = this;

          overlay.getPaths().forEach(function (path, index) {

            google.maps.event.addListener(path, 'insert_at', function () {
              console.log("New Point");

              for (let i = 0; i < self.overlayAreas.length; i++) {

                if (self.overlayAreas[i].getPath() == path) {
                  console.log("ACHOU i:", i);
                  self.overlayAreas.splice(i, 1, overlay);
                }
              }
              //self.overlayAreas.push(overlay);
              self.calculateAndFillPropertyArea(overlay);

            });

            google.maps.event.addListener(path, 'set_at', function () {
              //console.log("Point was moved", path, overlay);
              ///self.calculateAndFillPropertyArea(overlay);

            });

          });

          this.calculateAndFillPropertyArea(overlay);

          this.overlayAreas.push(overlay);      //Add overlay to array of overlays
        }
      });

    });
  }

  /*********************************************** Property Functions ***********************************************/

  createForm() {
    this.form = this.formBuilder.group({
      propertyName: ['', Validators.required],
      areaName: ['', Validators.required],
      havestType: ['', Validators.required],
      //date: ['', Validators.required],
      propertyArea: ['', Validators.required]
    });
  }

  onResetClick() {
    console.log(this.overlayAreas.length);
    let size = this.overlayAreas.length - 1;
    this.deleteSelectedOverlay(size);
    this.deleteSelectedMarker(size);

    this.form.get('propertyArea').setValue("");

    this.processingCancel = true;
  }

  onAddPropertyClick() {
    console.log(this.drawnArea);
    console.log(this.property);
    this.processingAdd = true;

    //let dt = this.form.controls['date'].value
    //console.log("DATE:", dt);
    //this.drawnArea.dataColheita = dt.day + "/" + dt.month + "/" + dt.year;
    this.drawnArea.plantio = this.form.controls['havestType'].value;
    this.drawnArea.nome = this.form.controls['areaName'].value;
    this.areas.push(this.drawnArea);

    this.property.nome = this.form.controls['propertyName'].value;
    this.property.areaTotal += this.drawnArea.areaTotal;

    console.log("prp", this.property);


    this.addAreaName(this.overlayAreas.length - 1, this.form.controls['areaName'].value);

    // Reset form
    this.createForm();
    // Set the same property name
    this.form.get('propertyName').setValue(this.property.nome);
    this.processingAdd = false;
    this.processingCancel = true;

  }

  onRegisterPropertyClick() {
    console.log("register property", this.property);

    let usr = JSON.parse(localStorage.getItem('user'));

    this.property.usuarioId = usr.id;
    this.property.nome = this.form.controls['propertyName'].value;

    // If register
    if (!this.propIdParameter) {
      this.propertyService.registerProperty(this.property).subscribe(data => {
        console.log("register:", data);

        this.property.id = data.id;

        for (let area of this.areas) {

          this.propertyService.registerArea(this.property.id, area.nome, area.areaTotal, area.plantio, area.area).subscribe(areaData => {
            this.setMessage('alert alert-success', Messages.SUC_REGISTER_AREA);
          }, err => {
            this.processingAdd = false;            
            this.setMessage('alert alert-danger', err.error.message);
          });
        }
      }, err => {
        console.log("error register property");
        this.processingAdd = false;        
        this.setMessage('alert alert-danger', err.error.message);
      });
    }
    else { //Edit
      this.propertyService.updatePropertyById(this.property).subscribe(data => {
        console.log("edit property:", data);

        this.setMessage('alert alert-success', Messages.SUC_EDIT_PROPERTY);

        for (let i = 0; i < this.areas.length; i++) {

          if (this.areas[i].id) {
            console.log(this.areas[i]);
            this.propertyService.updateAreaById(this.areas[i]).subscribe(data => {

              console.log("update areas:", data);

            });
          }
          else {

            let reqArea = {
              nome: this.areas[i].nome,
              propriedadeId: this.property.id,
              areaTotal: this.areas[i].areaTotal,
              plantio: this.areas[i].plantio,
              //dataColheita: area.dataColheita,
              area: this.areas[i].area
            }

            this.propertyService.registerArea(this.property.id, this.areas[i].nome, this.areas[i].areaTotal, this.areas[i].plantio, this.areas[i].area).subscribe(data => {

              console.log("register area:", data);

            });
          }
        }

      }, err => {
        this.messageClass = 'alert alert-danger';
        this.message = err.error.message;
        this.processingAdd = false;
      });
    }
  }

  calculateAndFillPropertyArea(overlay) {
    var areaM2 = google.maps.geometry.spherical.computeArea(overlay.getPath()); // Get area
    var areaHa = this.squareMetersToHectare(areaM2)                             // Convert to Hectare
    this.mapProps.drawingMode = '';                                             // Stop drawing mode 
    console.log("area:", areaHa);
    var areasOverlay: Area = new Area();

    areasOverlay.areaTotal = areaHa;//.toString();          

    for (let coord of overlay.getPath().getArray()) {
      let lat = coord.lat();
      let lng = coord.lng();
      areasOverlay.area.push(new Array<number>(lat, lng));
    }

    this.drawnArea = areasOverlay;
    this.fillPropertyArea(areasOverlay);  //Put total area in forms

    console.log(this.overlayAreas);

    this.processingCancel = false;
  }

  fillPropertyArea(data: Area) {
    let num = new Number(+data.areaTotal);
    this.form.get('propertyArea').setValue(num.toPrecision(2));
  }

  onRemoveOverlayClick(area) {

    for (let i = 0; i < this.areas.length; i++) {
      if (this.areas[i] == area) {
        console.log("achou i");
        this.propertyService.deleteAreaById(this.areas[i].id).subscribe(data => {
          this.areas.splice(i, 1);
          this.deleteSelectedOverlay(i);
          this.deleteSelectedMarker(i);
        }, err=> {
          //TODO: ERROR MESSAGE 
        });
      }

    }
    console.log(area);
  }

  onEditAreaClick(area: Area) {

    // let date = area.dataColheita.split('/');
    // console.log(date);

    // let dt = {
    //   year: +date[2],
    //   month: +date[1],
    //   day: +date[0]
    // }

    // console.log("dt:", dt);

    this.form.controls['areaName'].setValue(area.nome);
    this.form.controls['havestType'].setValue(area.plantio);
    //this.form.controls['date'].setValue(dt);
    this.form.controls['propertyArea'].setValue(area.areaTotal);
  }

  /*********************************************** Maps Functions ***********************************************/

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

  deleteSelectedOverlay(id: number) {
    console.log("called ", id, " ", this.overlayAreas);
    if (this.overlayAreas[id]) {
      this.overlayAreas[id].setMap(null);
      this.overlayAreas.splice(id, 1);
    }
    else {
      console.log("error in delete selected overlay");
    }
  }

  deleteSelectedMarker(id: number) {
    console.log("marker called ", id);
    if (this.makerLabels[id]) {
      this.makerLabels[id].setMap(null);
      this.makerLabels.splice(id, 1);
    }
    else {
      console.log("error in delete selected makerLabels");
    }
  }

  // Add area name in drawn area overlay
  addAreaName(objId, areaName) {

    if (this.overlayAreas[objId]) {

      var bounds = new google.maps.LatLngBounds();

      for (let coord of this.overlayAreas[objId].getPath().getArray()) {
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
          text: areaName,
          color: 'white',
        }
      });

      this.makerLabels.push(marker);
    }
  }

  clickDrawPolygon() {
    this.mapProps.drawingMode = 'polygon';
  }

  clickMovePolygon() {
    this.mapProps.drawingMode = '';
  }

  clickZoomIn() {
    this.currentMap.setZoom(this.currentMap.getZoom() + 1);
    //this.ref.detectChanges();
  }

  clickZoomOut() {
    this.currentMap.setZoom(this.currentMap.getZoom() - 1);
    //this.ref.detectChanges();
  }

  onMapReady(event) {

    if (this.propData.clientPosition) {
      console.log("client position");
      this.mapProps.center = new google.maps.LatLng(this.propData.clientPosition.coords.latitude, this.propData.clientPosition.coords.longitude);
    }

    this.currentMap = event;

    for (let coord of this.polygonsCoord) {
      this.addPolygons(coord);
    }
  }

  drawPolygons(areas: Array<Area>) {


    if (this.currentMap) {
      this.addPolygons(areas);
    } else {
      this.polygonsCoord.push(areas);
    }

  }

  addPolygons(areas: Array<Area>) {

    var globalBounds = new google.maps.LatLngBounds();

    for (let area of areas) {

      var bounds = new google.maps.LatLngBounds();
      var coords = new Array<any>();

      for (let i = 0; i < area.area.length; i++) {
        let coordinate = area.area[i];
        let lat = coordinate[0];
        let lng = coordinate[1];

        bounds.extend(new google.maps.LatLng(lat, lng));
        globalBounds.extend(new google.maps.LatLng(lat, lng));
        coords.push({ lat: lat, lng: lng });
      }

      var newPolygon = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });

      newPolygon.setMap(this.currentMap);

      this.overlayAreas.push(newPolygon);

      var marker = new google.maps.Marker({
        position: bounds.getCenter(),
        map: this.currentMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0
        },
        label: {
          text: area.nome,
          color: 'white',
        }
      });

      this.makerLabels.push(marker);
    }

    console.log("setou center");
    this.mapProps.center = new google.maps.LatLng(globalBounds.getCenter().lat(), globalBounds.getCenter().lng());
    this.currentMap.fitBounds(globalBounds);

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

  /*********************************************** Utilities ***********************************************/

  setMessage(messageClass, message) {
    this.messageClass = messageClass;
    this.message = message;
  }

  squareMetersToHectare(area: any): number {
    return area / 10000;
  }
}
