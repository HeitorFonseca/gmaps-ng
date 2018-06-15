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

  propNameParameter;
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

  /* auxiliar */
  auxOverlay:any;

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

    // Get property name from router parameter
    this.propNameParameter = this.route.snapshot.paramMap.get('name');

    console.log("propName=", this.propNameParameter);

    // If has a property name is because the user is editing the property
    if (this.propNameParameter) {
      // Get the property
      var properties = this.propData.propertyData;

      // If property does not exist
      if (!properties) {
        // Request all property
        this.propertyService.getProperties().subscribe(data => {

          properties = data;
          // Store all properties
          this.propData.propertyData = properties;

          // Check the property that has the same name as propName
          for (let prop of properties) {
            if (prop.PropertyName == this.propNameParameter) {              
              this.property = prop;                                              // Save the property
              this.form.get('propertyName').setValue(this.property.PropertyName);// Set property name     
              this.drawPolygons(this.property)                                   // Draw polygons from property
            }
          }
        });

      } else {
        for (let prop of properties) {
          if (prop.PropertyName == this.propNameParameter) {
            this.property = prop;                                               // Save the property
            this.form.get('propertyName').setValue(this.property.PropertyName); // Set property name         
            this.drawPolygons(this.property)                                    // Draw polygons from property
          } 
        }
      }        
    } else {
      this.property = new Property();
    }
  }

  ngOnInit() {    

    this.drawingManager['initialized$'].subscribe(dm => {

      // Add listener for when user draw a polygon
      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {

          var overlay: any;
          google.maps.event.addListener(event.overlay, 'click', e => {
            overlay = event.overlay;
            overlay.setEditable(true);
          });

          overlay = event.overlay;          
          
          var areaM2 = google.maps.geometry.spherical.computeArea(overlay.getPath()); // Get area
          var areaHa = this.SquareMetersToHectare(areaM2)                             // Convert to Hectare
          this.mapProps.drawingMode = '';                                             // Stop drawing mode 

          var areasOverlay: AreasOverlay = new AreasOverlay;
          
          areasOverlay.Area = areaHa.toString();          

          for (let coord of overlay.getPath().getArray()) {
            let lat = coord.lat();
            let lng = coord.lng();
            areasOverlay.Lats.push(lat.toString());
            areasOverlay.Lngs.push(lng.toString());
          }

          this.auxOverlay = areasOverlay;
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

    this.property.AreasOverlay.push(this.auxOverlay);

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
    // Set the same property name
    this.form.get('propertyName').setValue(this.property.PropertyName);
    this.processing = false;

  }

  onRegisterPropertyClick() {
    console.log("register property", this.property);
    if (!this.propNameParameter) {
      this.propertyService.registerProperty(this.property).subscribe(data => {
        console.log(data);
      });
    }
    else {
      this.propertyService.editProperty(this.property).subscribe(data => {
        console.log("edit property");
        console.log(data);
      });
    }
  }

  fillPropertyArea(data:AreasOverlay) {   
    let num = new Number(+data.Area);
    this.form.get('propertyArea').setValue(num.toPrecision(1));
  }

  onRemoveOverlayClick(area) {

    for (let i = 0; i < this.property.AreasOverlay.length; i++) {
      if (this.property.AreasOverlay[i] == area) {
        console.log("achou i");
        this.property.AreasOverlay.splice(i);
        this.deleteSelectedOverlay(i);
        this.deleteSelectedMarker(i);
      }
    
    }
    console.log(area);
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
      this.overlayAreas.splice(id);
    }
    else {
      console.log("error in delete selected overlay");
    }
  }

  deleteSelectedMarker(id: number) {
    console.log("marker called ", id);
    if (this.makerLabels[id]) {
      this.makerLabels[id].setMap(null);
      this.makerLabels.splice(id);
    }
    else {
      console.log("error in delete selected makerLabels");
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

      this.overlayAreas.push(bermudaTriangle);

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
