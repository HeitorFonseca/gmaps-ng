import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { } from '@types/googlemaps';
import { NguiMap, DataLayer, DrawingManager, NguiMapComponent } from '@ngui/map';
import { zip } from 'rxjs';

import { PropertyService } from '../../../services/property.service';
import { Property, AreasOverlay } from '../../../models/property';

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
  processing;

  /* remove */
  areas =  new FormArray([]);


  /*********************************************** Variable Declarations ***********************************************/

  constructor(private route: ActivatedRoute, 
              private propData: Data,
              private propertyService: PropertyService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private ref: ChangeDetectorRef,
              private formBuilder: FormBuilder) 
  { 
    // Create Form
    this.createForm();

    var propName = this.route.snapshot.paramMap.get('name');

    console.log("propName=", propName);

    if (propName) {
      var properties = this.propData.propertyData;

      if (!properties) {
        this.propertyService.getProperties().subscribe(data => {

          properties = data;
          console.log(properties);
          this.propData.propertyData = properties;

          console.log("propreties of subscribe", properties);

          for (let prop of properties) {
            if (prop.PropertyName == propName) {
              this.property = prop;
              this.form.get('propertyName').setValue(this.property.PropertyName);     
              this.drawPolygons(this.property)       
            }
          }
        });

      } else {
        for (let prop of properties) {
          if (prop.PropertyName == propName) {
            this.property = prop;
            console.log("achou");
            this.form.get('propertyName').setValue(this.property.PropertyName);     
            this.drawPolygons(this.property)       
          }
        }
      }        
    }
  }

  ngOnInit() {

    
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
          var areaHa = this.SquareMetersToHectare(areaM2)
          this.mapProps.drawingMode = '';

          var areasOverlay: AreasOverlay = new AreasOverlay;

          areasOverlay.AreaName = areaHa.toString();

          let array = overlay.getPath().getArray();

          for (let coord of overlay.getPath().getArray()) {
            let lat = coord.lat();
            let lng = coord.lng();
            areasOverlay.Lats.push(lat.toString());
            areasOverlay.Lngs.push(lng.toString());
          }

          this.fillPropertyArea(areasOverlay);

          this.overlayAreas.push(overlay);
          console.log(this.overlayAreas);
        }
      });

    });
  }

  /*********************************************** Property Functions ***********************************************/

  createForm()
  {
    this.form = this.formBuilder.group({
      propertyName: ['', Validators.required],
      areaName: ['', Validators.required],
      havestType: ['', Validators.required],
      date: ['', Validators.required],
      propertyArea: ['', Validators.required]
    });
  }

  onResetClick() {
    console.log(this.areas.length);
   this.deleteSelectedOverlay(this.areas.length);
  }

  onAddPropertyClick() {
    this.processing = true;

    // Property Name
    this.property.PropertyName = this.form.controls['propertyName'].value
    // Area in Hectare
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].Area = this.form.controls['propertyArea'].value
    // Date
    let dt = this.form.controls['date'].value;
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].HarvestDate = dt.day + "/" + dt.month + "/" + dt.year;
    // Harvest Type
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].HarvestType =  this.form.controls['havestType'].value;
    // Area Name
    this.property.AreasOverlay[this.property.AreasOverlay.length-1].AreaName = this.form.controls['areaName'].value;

    console.log("prp", this.property);
    
    this.areas.push(this.form);

    // Add area name in maps
    var objStr = JSON.stringify({"id":this.areas.length-1, "areaName": this.form.controls['areaName'].value})
    this.addAreaName(objStr);

    // Reset form
    this.createForm();

    this.form.get('propertyName').setValue(this.property.PropertyName);
    this.processing = false;

  }

  onRegisterPropertyClick() {
    console.log("register property", this.property);
    this.propertyService.registerProperty(this.property).subscribe(data => {
      console.log(data);
    });
  }

  fillPropertyArea(data:AreasOverlay) {   
    let num = new Number(+data.AreaName);

    this.form.get('propertyArea').setValue(num.toPrecision(1));
    this.property.AreasOverlay.push(data);
  }

  onRemoveOverlayClick(area) { 
    console.log("area");
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
      // delete this.overlayAreas[id];
      this.overlayAreas.splice(id);

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

    this.mapProps.center = new google.maps.LatLng(globalBounds.getCenter().lat(), globalBounds.getCenter().lng());
    //this.mapProps.zoom = 17;
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

  SquareMetersToHectare(area: any): Number {
    return area / 10000;
  }
}
