import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { } from '@types/googlemaps';
import { NguiMap,  DataLayer, DrawingManager} from '@ngui/map';

import { PropertyService } from '../../../services/property.service';
import { Property } from '../../../models/property';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {

map:any;
property:Property = new Property();

mapProps: any = {
  center: 'Recife',
  zoom: 12,
  drawingMode: '',
};


  constructor(private route: ActivatedRoute, private router: Router,
              private propertyService:PropertyService) { }

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

      for (let i = 0; i < areas.Lats.length; i++) {
        coords.push({lat: +areas.Lats[i], lng: +areas.Lngs[i]});
        bounds.extend(new google.maps.LatLng(+areas.Lats[i], +areas.Lngs[i]));
        globalBounds.extend(new google.maps.LatLng(+areas.Lats[i], +areas.Lngs[i]));
      }

      var bermudaTriangle = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });

      bermudaTriangle.setMap(this.map);

      var marker = new google.maps.Marker({
        position: bounds.getCenter(),
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0
        },
        label: {
          text: areas.AreaName,
          color: 'white',
        }
      });     
    }

    this.mapProps.center = new google.maps.LatLng(globalBounds.getCenter().lat(), globalBounds.getCenter().lng());
    this.mapProps.zoom = 17;
  }

  onMapReady(event)
  {
    this.map = event;

    this.drawPolygonsAndLabels();
    console.log(this.map);
  }


  onEditPropertyClick() {
    console.log("edit property");
    this.router.navigate(['/map', this.property.PropertyName]);
  }

  onRemoveProperty() {
    console.log("onRemoveProperty");
    this.propertyService.deletePropertyByName(this.property.PropertyName).subscribe(data =>
    {
      console.log(data);
      this.router.navigate(['/home']);

    });
  }
}
