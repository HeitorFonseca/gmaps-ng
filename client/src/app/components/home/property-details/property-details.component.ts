import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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


  constructor(private route: ActivatedRoute,
              private propertyService:PropertyService) { }

  ngOnInit() {
    var propName = this.route.snapshot.paramMap.get('propertyName');

    this.propertyService.getPropertiyByName(propName).subscribe(data => {
      this.property = data[0];
      console.log("data res", this.property);

     

    })

  }

  drawPolygons() {

    for (let areas of this.property.AreasOverlay) {
      var coords = new Array<any>();

      for (let i = 0; i < areas.Lats.length; i++) {
        coords.push({lat: +areas.Lats[i], lng: +areas.Lngs[i]});
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
    }
  }

  onMapReady(event)
  {
    this.map = event;

    this.drawPolygons();
    console.log(this.map);
  }

}
