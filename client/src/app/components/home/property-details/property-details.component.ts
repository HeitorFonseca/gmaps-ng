import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { } from '@types/googlemaps';
import { NguiMap, DataLayer, DrawingManager } from '@ngui/map';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PropertyService } from '../../../services/property.service';
import { Property, Analysis, Area } from '../../../models/property';

import { TechReport } from './../../../models/techReport'
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})

export class PropertyDetailsComponent implements OnInit {

  @ViewChild('clickInPointsModal') clickInPointsModal: TemplateRef<any>;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild(DataLayer) dataLayer: DataLayer;

  newPolygons: Array<any> = new Array<any>();
  map: any;

  technicians: Array<User> = new Array<User>();;
  property: Property = new Property();
  analyses: Array<Analysis> = new Array<Analysis>();
  reports: Array<TechReport>;
  selectedReport: TechReport;
  selectedAnalysis: any;
  selectedPointLabel: number;
  geoJsonObject: any;

  mapProps: any = {
    center: 'Sao Paulo',
    zoom: 12,
    drawingMode: '',
  };

  checkBoxBtn = {
    NDVI: false,
    NDWI: false,
    Produtividade: false
  };

  globalBounds: any;
  propertyAnalyses;
  areaNameLabels: Array<any> = new Array<any>();
  samplingPointsLabels: Array<any> = new Array<any>();
  samplingPoints: any;

  /* Booleans */
  drawnPoints = false;
  requestedAnalysis = false;

  stateLayer: any;

  /********************************************** Variables *****************************************/

  areas: Array<Area> = new Array<Area>();
  alreadyDrawnPolygonsAndLabels = false;
  selectedTechnician:any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private userService: UserService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private zone: NgZone) { }

  ngOnInit() {
    var propId = this.route.snapshot.paramMap.get('propertyName');
    let usr = JSON.parse(localStorage.getItem('user'));

    console.log("prop id route", propId);

    this.propertyService.getPropertyById(propId).subscribe(data => {
      this.property = data as Property;
      console.log("property res", data);

      this.propertyService.getAreasByProperty(this.property.id).subscribe(data => {
        console.log("areas:", data);
        this.areas = data as Array<Area>;

        if (!this.alreadyDrawnPolygonsAndLabels && this.map) {
          this.drawPolygonsAndLabels();
        }
      });

      if (usr.tipo == "administrador" && !this.property.tecnicoId) {
        
        this.userService.getTechnicians().subscribe(data => {

          this.technicians = data as Array<User>;
          console.log("get technicians:", data);
        });
      }
      else if (this.property.tecnicoId) {
        this.selectedTechnician = this.property.tecnicoId;
      }

    });


  }

  // Function to draw the Polygons in map
  drawPolygonsAndLabels() {

    this.globalBounds = new google.maps.LatLngBounds();

    for (let areas of this.areas) {
      this.alreadyDrawnPolygonsAndLabels = true;

      var coords = new Array<any>();
      var bounds = new google.maps.LatLngBounds();

      for (let i = 0; i < areas.area.length; i++) {
        let coordinate = areas.area[i];
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

      this.newPolygons.push(newPolygon);

      var marker = new google.maps.Marker({
        position: bounds.getCenter(),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,
        },
        label: {
          text: areas.nome,
          color: 'white',
        },

      });

      marker.setMap(this.map);
      this.areaNameLabels.push(marker);

    }

    if (this.globalBounds) {
      console.log("Setou center");
      this.mapProps.center = new google.maps.LatLng(this.globalBounds.getCenter().lat(), this.globalBounds.getCenter().lng());
      this.map.fitBounds(this.globalBounds);
    }

  }

  clearPolygons() {
    console.log(this.newPolygons);
    for (let i = 0; i < this.newPolygons.length; i++) {
      this.newPolygons[i].setMap(null);
    }
  }

  onMapReady(event) {
    this.map = event;

    //var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-34.87013339996337,-8.048734091115579],[-34.889960289001465,-8.049498957184937],[-34.887986183166504,-8.071934385576592],[-34.87013339996337,-8.048734091115579]]]}},{"type":"Feature","properties":{"stroke":"#555555","stroke-width":0,"stroke-opacity":1,"fill":"#238741","fill-opacity":1},"geometry":{"type":"Polygon","coordinates":[[[-34.88532543182373,-8.056892588056478],[-34.88064765930175,-8.056892588056478],[-34.88064765930175,-8.052430930406018],[-34.88532543182373,-8.052430930406018],[-34.88532543182373,-8.056892588056478]]]}}]}';
    var path = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"stroke": "#2c4a7e","stroke-opacity":1,"fill":"#2c4a7e","fill-opacity":0.95},"geometry":{"type":"MultiPolygon","coordinates":[[[[-34.89333518759463,-8.084607456024665],[-34.89335664526675,-8.084397146995938],[-34.89330300108645,-8.084284481399724],[-34.893190348307826,-8.084254437235414],[-34.89308305994723,-8.084261948276689],[-34.892617439858554,-8.084435481726352],[-34.89229289256775,-8.084533125208315],[-34.892207061879276,-8.084574435905122],[-34.89206222259247,-8.084615746597692],[-34.891976391903995,-8.084668323836665],[-34.89190129005158,-8.084668323836665],[-34.89179936610901,-8.084747189682274],[-34.891616975896,-8.084788500357147],[-34.891504323117374,-8.084837322058359],[-34.89142385684693,-8.084863610664232],[-34.89138094150269,-8.084908676841804],[-34.89128438197815,-8.084942476471651],[-34.89126828872406,-8.084968765070718],[-34.89117977582657,-8.084983787126538],[-34.89111808501923,-8.08507391944975],[-34.89117172919953,-8.08509269701455],[-34.89122269117081,-8.085122741116407],[-34.891498958699344,-8.08516029624058],[-34.891641115777134,-8.0851753182893],[-34.89169475995743,-8.085156540728352],[-34.891949569813846,-8.085231650966904],[-34.892075633637546,-8.085261695058415],[-34.89218023978913,-8.085269206080937],[-34.892233883969425,-8.085227895455326],[-34.8923197146579,-8.085280472614478],[-34.89241090976441,-8.08530676119151],[-34.89252356254303,-8.085303005680606],[-34.89268181287491,-8.085254184035767],[-34.8928051944896,-8.08519034033741],[-34.89308682643616,-8.085062652910445],[-34.89316729270661,-8.08501007572287],[-34.89322898351395,-8.084923698899864],[-34.893263852231144,-8.084852344119051],[-34.89331481420243,-8.084739678649983],[-34.89333518759463,-8.084607456024665]],[[-34.89259958267212,-8.084617500019943],[-34.89263713359833,-8.084646711088103],[-34.892586171627045,-8.084678577705512],[-34.89253789186478,-8.08463343333011],[-34.89259958267212,-8.084617500019943]]]]}},{"type":"Feature","properties":{"stroke":"#24616B","stroke-opacity":1,"fill":"#24616B","fill-opacity":0.95},"geometry":{"type":"MultiPolygon","coordinates":[[[[-34.89259958267212,-8.084617500019943],[-34.89263713359833,-8.084646711088103],[-34.892586171627045,-8.084678577705512],[-34.89253789186478,-8.08463343333011],[-34.89259958267212,-8.084617500019943]]]]}}]}'

    var geojson = JSON.parse(path);

    this.geoJsonObject = geojson;

    this.dataLayer['initialized$'].subscribe(dl => {
      this.stateLayer = new google.maps.Data();
    })

    if (!this.alreadyDrawnPolygonsAndLabels) {
      this.drawPolygonsAndLabels();
    }

    console.log(this.map);
  }


  // On Edit property click -> router to map with selected property data
  onEditPropertyClick() {
    console.log("edit property");
    this.router.navigate(['/map', this.property.id]);
  }

  // On remove property click
  onRemoveProperty(modal) {
    console.log("onRemoveProperty");

    const modalRef = this.modalService.open(modal);
    this.activeModal = modalRef;

    modalRef.result.then((userResponse) => {
      if (userResponse) {
        this.propertyService.deletePropertyById(this.property.id).subscribe(data => {
          console.log("delete property:", data);
          this.router.navigate(['/home']);
        });
      }
    }).catch(() => { });
  }

  // When click in Confirmar Button in html 
  onRequestAnalysisClick() {
    console.log("request analysis");

    console.log(this.checkBoxBtn);

    let dt = new Date().toISOString().split('T')[0]

    if (this.checkBoxBtn.NDVI || this.checkBoxBtn.NDWI || this.checkBoxBtn.Produtividade) {
      let analysis = {
        PropertyId: this.property.id,
        Type: (this.checkBoxBtn.NDVI ? '1' : (this.checkBoxBtn.NDWI ? '2' : '3')),
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
  }

  // Event from calendar when click to view Analysis
  requestDrawAnalysis(analysis: Analysis) {
    this.selectedAnalysis = analysis;


    this.stateLayer.addGeoJson(this.geoJsonObject);
    this.stateLayer.setStyle(function (feature) {
      var ascii = feature.getProperty('ascii');
      var color = feature.getProperty('fill');
      var fillOpacity = feature.getProperty('fill-opacity');
      var stroke = feature.getProperty('stroke');
      var stroke_opacity = feature.getProperty('stroke-opacity');
      return {
        fillColor: color,
        strokeWeight: 1,
        fillOpacity: fillOpacity,
        strokeColor: stroke,
        stroke_opacity: stroke_opacity

      };
    });
    this.stateLayer.setMap(this.map);

    this.requestedAnalysis = true;
    this.clearPolygons();
    this.drawAreaNameMarker();
    this.clearSamplingPoints();
  }

  requestSamplingPoints() {


    console.log("Requesting sampling points:");

    this.propertyService.getPropertyAnalysisPoints(this.property.id, this.selectedAnalysis.Date, this.selectedAnalysis._id).subscribe(data => {

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
      ClientName: this.property.nome, Allotment: "this.property.AreasOverlay[0].AreaName", Compaction: '',
      Date: "this.property.AreasOverlay[0].HarvestDate", EvaluationType: "this.property.AreasOverlay[0].HarvestType",
      ExtraComments: '', Latitude: '', Longitude: '', Material: '', PointNumber: pointLabel, PropertyName: "this.property.PropertyName",
      SoilAnalysis: '', Weight: ''
    }

    techReport.PlantEvaluation = {
      Allotment: "this.property.AreasOverlay[0].AreaName", Date: '', Latitude: '', Longitude: '',
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

  /* GeoJson functions */

  styleFunc(feature) {
    return {
      fillColor: feature.properties.color.toString(),
      strokeWeight: 1
    };
  }

  /********************************************** Administrator fuctions *****************************************/


  registerTechToProperty() {
    
    if (this.selectedTechnician) {

      let reqTechProp = {
        tecnicoId: this.selectedTechnician,
      }

      console.log(reqTechProp);

      // this.propertyService.registerTechnicianToProperty(this.property., reqTechProp).subscribe(data => {
      //   console.log("register tech to property:", data);
      // });
    }
    else {

    }

  }

  ChangeValue(event) {
    console.log(event);
    this.selectedTechnician = event.target.value;
  }

}
