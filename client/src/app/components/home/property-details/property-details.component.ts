import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { } from '@types/googlemaps';
import { NguiMap, DataLayer, DrawingManager } from '@ngui/map';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PropertyService } from '../../../services/property.service';
import { Property, Analysis } from '../../../models/property';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})

export class PropertyDetailsComponent implements OnInit {

  @ViewChild('clickInPointsModal') clickInPointsModal: TemplateRef<any>;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;


  map: any;
  property: Property = new Property();

  mapProps: any = {
    center: 'Recife',
    zoom: 12,
    drawingMode: '',
  };

  checkBoxBtn = {
    NDVI: true,
    NDWI: true,
    Produtividade: true
  };

  propertyAnalyses;
  makerLabels: Array<any> = new Array<any>();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private zone: NgZone) { }

  ngOnInit() {
    var propName = this.route.snapshot.paramMap.get('propertyName');

    this.propertyService.getPropertyByName(propName).subscribe(data => {
      this.property = data[0];

      console.log("data res", this.property);
    })


  }

  drawPolygonsAndLabels() {

    var globalBounds = new google.maps.LatLngBounds();

    for (let areas of this.property.AreasOverlay) {
      var coords = new Array<any>();
      var bounds = new google.maps.LatLngBounds();

      for (let i = 0; i < areas.Coordinates.length; i++) {
        let coordinate = areas.Coordinates[i];
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

      newPolygon.setMap(this.map);

      var marker = new google.maps.Marker({
        position: bounds.getCenter(),
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,

        },
        label: {
          text: areas.AreaName,
          color: 'white',
        },

      });
    }

    this.mapProps.center = new google.maps.LatLng(globalBounds.getCenter().lat(), globalBounds.getCenter().lng());
    //this.mapProps.zoom = 17;
    this.map.fitBounds(globalBounds);
  }

  onMapReady(event) {
    this.map = event;

    this.drawPolygonsAndLabels();
    console.log(this.map);
  }


  onEditPropertyClick() {
    console.log("edit property");
    this.router.navigate(['/map', this.property.PropertyName]);
  }

  onRemoveProperty(modal) {
    console.log("onRemoveProperty");

    const modalRef = this.modalService.open(modal);
    this.activeModal = modalRef;

    modalRef.result.then((userResponse) => {
      console.log("lelele:", userResponse);

      if (userResponse) {
        this.propertyService.deletePropertyByName(this.property.PropertyName).subscribe(data => {
          console.log(data);
          this.router.navigate(['/home']);
        });
      }
    }).catch(() => { });

    console.log('passou');
  }

  onRequestAnalysisClick() {
    console.log("request analysis");
  }

  selectedAnalysis(analysis: Analysis) {
    console.log("selectedAnalysis", analysis);

    console.log("Requesting sampling points:");

    this.propertyService.getPropertyAnalysisPoints(1, analysis.Date, analysis.AnalysisId).subscribe(data => {
      var points = data.Geometry;
      console.log(data);

      let pCounter = 1;
      if (data.Geometry[0].Type == "Point") {
        for (let points of data.Geometry[0].Coordinates) {

          var marker = new google.maps.Marker({
            //FIX TODO
            position: new google.maps.LatLng(points[1], points[0]),
            map: this.map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3,
              strokeWeight: 1,
            },
            label: {
              text: pCounter.toString(),
              color: 'white',
            },

          });
          
          // marker.addListener('click', function (localMarker,i) {

          //   console.log("this marker was clicked:", localMarker );
          //   const modalRef = this.modalService.open(this.modalContent, { size: 'lg' });
          //   this.activeModal = modalRef;

          // }.bind(this));

          let self = this;

          google.maps.event.addListener(marker, 'click', function(evt){
            console.log(this);
            console.log(evt);
            console.log("this marker was clicked:" );
            console.log("label:", this.label.text );

            const modalRef = self.modalService.open(self.modalContent, { size: 'lg' });
            self.activeModal = modalRef;
          });

          pCounter++;
          this.makerLabels.push(marker);

        }
      }
    });
  }


}
