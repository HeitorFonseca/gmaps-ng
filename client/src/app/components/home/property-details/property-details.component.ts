import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { } from '@types/googlemaps';
import { NguiMap, DataLayer, DrawingManager } from '@ngui/map';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PropertyService } from '../../../services/property.service';
import { Property, Analysis } from '../../../models/property';

import { TechReport } from './../../../models/techReport'

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
  analyses: Array<Analysis> = new Array<Analysis>();
  reports: Array<TechReport>;
  selectedReport: TechReport;
  selectedAnalysis: any;
  selectedPointLabel: number;

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

  globalBounds: any;
  propertyAnalyses;
  areaNameLabels: Array<any> = new Array<any>();
  samplingPointsLabels: Array<any> = new Array<any>();
  samplingPoints: any;

  /* Booleans */
  drawnPoints = false;
  requestedAnalysis = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private zone: NgZone) { }

  ngOnInit() {
    var propName = this.route.snapshot.paramMap.get('propertyName');
    let usr = JSON.parse(localStorage.getItem('user'));

    this.propertyService.getPropertyByName(usr.OwnerId, propName).subscribe(data => {
      this.property = data[0];
      console.log("property res", this.property);

      this.propertyService.getPropertyAnalyses(this.property._id).subscribe(data => {
        this.analyses = data
        console.log("analysis res", this.analyses);

      });
    });
  }

  // Function to draw the Polygons in map
  drawPolygonsAndLabels() {

    this.globalBounds = new google.maps.LatLngBounds();

    for (let areas of this.property.AreasOverlay) {
      var coords = new Array<any>();
      var bounds = new google.maps.LatLngBounds();

      for (let i = 0; i < areas.Coordinates.length; i++) {
        let coordinate = areas.Coordinates[i];
        let lat = coordinate[0];
        let lng = coordinate[1];

        bounds.extend(new google.maps.LatLng(lat, lng));
        this.globalBounds.extend(new google.maps.LatLng(lat, lng));
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

    marker.setMap(this.map);

    this.areaNameLabels.push(marker);

    this.mapProps.center = new google.maps.LatLng(this.globalBounds.getCenter().lat(), this.globalBounds.getCenter().lng());
    this.map.fitBounds(this.globalBounds);
  }

  onMapReady(event) {
    this.map = event;

    this.drawPolygonsAndLabels();
    console.log(this.map);
  }


  // On Edit property click -> router to map with selected property data
  onEditPropertyClick() {
    console.log("edit property");
    this.router.navigate(['/map', this.property.PropertyName]);
  }

  // On remove property click
  onRemoveProperty(modal) {
    console.log("onRemoveProperty");

    const modalRef = this.modalService.open(modal);
    this.activeModal = modalRef;

    modalRef.result.then((userResponse) => {
      if (userResponse) {
        this.propertyService.deletePropertyByName(this.property.PropertyName).subscribe(data => {
          console.log(data);
          this.router.navigate(['/home']);
        });
      }
    }).catch(() => { });
  }

  // When click in Confirmar Button in html 
  onRequestAnalysisClick() {
    console.log("request analysis");

    let dt = new Date().toISOString().split('T')[0]

    let analysis = {
      PropertyId: this.property._id,
      Type: 3,
      Date: dt,
    }

    this.propertyService.registerPropertyAnalysis(analysis).subscribe(data => {

      if (data.success) {
        console.log("colocou");
        this.analyses.push(data.analysis);
        this.analyses = this.analyses;
      }

      console.log("pega ", data);
    });

  }

  // Event from calendar when click to view Analysis
  requestDrawAnalysis(analysis: Analysis) {
    this.selectedAnalysis = analysis;


    this.requestedAnalysis = true;
    
    this.drawAreaNameMarker();
    this.clearSamplingPoints();
  }

  requestSamplingPoints() {
    

    console.log("Requesting sampling points:");

    this.propertyService.getPropertyAnalysisPoints(this.property._id, this.selectedAnalysis.Date, this.selectedAnalysis._id).subscribe(data => {

      if (data) {

        this.clearAreaNameMarker();

        this.drawnPoints = true;

        this.samplingPoints = data;

        let pCounter = 1;
        if (data.Geometry[0].Type == "Point") {

          this.reports = new Array<TechReport>(data.Geometry[0].Coordinates.length);

          for (let points of data.Geometry[0].Coordinates) {

            // Add sampling points as markers
            var marker = new google.maps.Marker({
              //FIX TODO
              position: new google.maps.LatLng(points[1], points[0]),
              map: this.map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeWeight: 1,
                strokeOpacity: 0,
              },
              label: {
                text: pCounter.toString(),
                color: 'white',
              },

            });

            // When click in marker, open modal
            let self = this;
            google.maps.event.addListener(marker, 'click', function (evt) {
              console.log("label:", this.label.text);

              const modalRef = self.modalService.open(self.modalContent, { size: 'lg' });
              self.activeModal = modalRef;
              self.selectedPointLabel = +this.label.text;

              self.selectedReport = self.reports[self.selectedPointLabel - 1];

              self.selectedReport = self.fillTechReportWithDefaultData(self.selectedReport, self.selectedPointLabel);
            });

            pCounter++;
            this.samplingPointsLabels.push(marker);
          }
        }

        console.log(this.samplingPointsLabels[0]);

      }
      else {
        console.log("Empty points");
      }


    });
  }

  // When click in register tech form button (from point component)
  receiverTechReportForm(techReport: TechReport) {
    console.log('Foi emitido o evento e chegou no pai >>>> ', techReport);

    console.log(this.reports);

    techReport.SamplingPointId = this.samplingPoints.Id;
    this.reports[this.selectedPointLabel - 1] = techReport;
    this.selectedReport = techReport;

    // this.propertyService.registerTechReport(techReport).subscribe(data => {
    //   console.log("Register tech report");
    //   console.log(data);
    // })

    this.changeSamplingPointLabelColor(this.selectedPointLabel);
  }

  // When click in eye button - clear sampling points from map
  clearSamplingPoints() {
    this.drawnPoints = false;

    for (let i = 0; i < this.samplingPointsLabels.length; i++) {
      this.samplingPointsLabels[i].setMap(null);
    }

    this.samplingPointsLabels = [];

    this.drawAreaNameMarker();
  }

  changeSamplingPointLabelColor(index) {
    console.log("mudou cor", this.samplingPointsLabels[index - 1].label);
    this.samplingPointsLabels[index - 1].label.color = "yellow";
    console.log("mudou cor", this.samplingPointsLabels[index - 1].label);
    this.samplingPointsLabels[index - 1].setMap(this.map);

  }

  // When click in eye button - clear area name label
  clearAreaNameMarker() {
    for (let i = 0; i < this.areaNameLabels.length; i++) {
      this.areaNameLabels[i].setMap(null);
    }
  }

  // When click in eye button - Add area name label
  drawAreaNameMarker() {
    for (let i = 0; i < this.areaNameLabels.length; i++) {
      this.areaNameLabels[i].setMap(this.map);
    }
  }

  fillTechReportWithDefaultData(techReport: TechReport, pointLabel) {

    if (!techReport) {
      techReport = new TechReport();
      console.log("create techreport", techReport);
    }

    techReport.CoverEvaluation = {
      ClientName: this.property.OwnerId, Allotment: this.property.AreasOverlay[0].AreaName, Compaction: '',
      Date: this.property.AreasOverlay[0].HarvestDate, EvaluationType: this.property.AreasOverlay[0].HarvestType,
      ExtraComments: '', Latitude: '', Longitude: '', Material: '', PointNumber: pointLabel, PropertyName: this.property.PropertyName,
      SoilAnalysis: '', Weight: ''
    }

    techReport.PlantEvaluation = {
      Allotment: this.property.AreasOverlay[0].AreaName, Date: '', Latitude: '', Longitude: '',
      PlantDistribution: { Linea1: [{ P1: '', P2: '' }], Linea2: [{ P1: '', P2: '' }], }, PlantStage: '',
      PropertyName: '', TotalPlantsIn10Meters: ''
    }

    techReport.SowingEvaluation = {

      Cultivation: '', Depth: '', Desiccation: '', ExtraComments: '', ExtraComments2: '', Germination: '',
      SeedDistribution: { Linea1: [{ P1: '', P2: '' }], Linea2: [{ P1: '', P2: '' }], }, SoilHumidity: '',
      Sower: '', SowingData: '', Spacing: '', TotalSeedsIn4Meters: '',
    }

    return techReport;
  }

  clickInitLocation() {
    this.mapProps.center = new google.maps.LatLng(this.globalBounds.getCenter().lat(), this.globalBounds.getCenter().lng());
    this.map.fitBounds(this.globalBounds);
  }

  clickZoomIn() {
    this.map.setZoom(this.map.getZoom() + 1);
    //this.ref.detectChanges();
  }

  clickZoomOut() {
    this.map.setZoom(this.map.getZoom() - 1);
    //this.ref.detectChanges();
  }
}
