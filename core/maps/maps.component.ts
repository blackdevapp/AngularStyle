import {Component, OnInit, Input} from '@angular/core';
import {icon, latLng, Layer, marker, tileLayer, circle, polyline} from "leaflet";
import {OpenStreetMapProvider} from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();
import * as L from 'leaflet';

declare const google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable?: boolean;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @Input() ltLn;
  @Input() show;
  @Input() position:boolean=false;
  search: string;
  results: string;
  map: L.Map;
  drawLineData: [number, number][] = [];

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: ''}),
      // circle([ 46.95, -122 ], { radius: 5000000 }),
      
    ],
    zoom: 14,
    center: latLng(35.6892,51.3890)
  };
  center: any = latLng(35.6892,51.3890);

  constructor() {
  }

  markers: Layer[] = [];
  lines: Layer[] = []

  // addMarker(lat, lng) {
  //     const newMarker = marker(
  //       [lat, lng],
  //       {
  //         icon: icon({
  //           iconSize: [25, 41],
  //           iconAnchor: [13, 41],
  //           iconUrl: './assets/img/map.svg'
  //         }),
  //         draggable: false,
  //         clickable: true
  //       }
  //     );

  //     this.markers.push(newMarker);


    
  // }
  getMidPoint(a,b){
    
    let latlng1 = a,
        latlng2 = b,
        offsetX = latlng2.lng - latlng1.lng,
        offsetY = latlng2.lat - latlng1.lat,
        r = Math.sqrt( Math.pow(offsetX, 2) + Math.pow(offsetY, 2) ),
        theta = Math.atan2(offsetY, offsetX),
        thetaOffset = (3.14/10),
        r2 = (r/2)/(Math.cos(thetaOffset)),
        theta2 = theta + thetaOffset,
        midpointX = (r2 * Math.cos(theta2)) + latlng1.lng,
        midpointY = (r2 * Math.sin(theta2)) + latlng1.lat,
        midpointLatLng:[number, number] = [midpointY, midpointX],
        pathOptions = {
          color: 'rgba(255,255,255,0.5)',
          weight: 2
        }
      return midpointLatLng
    // let newLine = polyline(this.drawLineData, {color: 'red'})
    // this.options.layers.
    // this.lines.push(newLine);
    
  }

  clicked(event) {
    if(!this.show){
      console.log(event);
      // this.addMarker(event.latlng.lat, event.latlng.lng);

    }


  }


  removeMarker() {
    this.markers.pop();
  }


  async searched() {
    this.results = await provider.search({query: this.search});
    console.log(this.results)
  }

  selected(event) {

    this.search = event.option.value.label;

    this.center = latLng(parseFloat(event.option.value.x), parseFloat(event.option.value.y))

    // this.addMarker(event.option.value.y, event.option.value.x);

  }

  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
    if (this.ltLn.type === 'pin') {
			this.setDesiredLatLng([this.ltLn.pointA.lat,this.ltLn.pointA.lng])
		}else if (this.ltLn.type === 'line') {
      let crdsA = this.ltLn.pointA,
          crdsB = this.ltLn.pointB,
          mid = this.getMidPoint(crdsA,crdsB);
      // this.addMarker(crdsA.lat, crdsA.lng )
      // this.addMarker(crdsB.lat, crdsB.lng )
      L.polyline([[ crdsA.lat, crdsA.lng ],[ crdsB.lat, crdsB.lng ]], {color: 'red'}).addTo(map);
      map.fitBounds([[ crdsA.lat, crdsA.lng ],[ crdsB.lat, crdsB.lng ]]);
      console.log(map.getZoom())
      map.setZoom(map.getZoom()-1);

      
		}
    
    

  }
  setDesiredLatLng(ltLn){
    this.center= latLng(ltLn[0],ltLn[1]);
    // this.addMarker(ltLn[0],ltLn[1]);
    this.options.zoom = 5;
  }
  invalidateSize() {
    if (this.map) {
      setTimeout(() => {this.map.invalidateSize(true)},100);
    }
  }

  ngOnInit() {
    this.markers=[];
    // this.center= latLng(35.6892,51.3890);
    // this.drawLine([45.51, -122.68],[37.77, -122.43])
    // this.showMap = true;
    // this.invalidateSize();
    // setTimeout(function () {
      
    // }, 0);
    //     const myLatlng = new google.maps.LatLng(40.748817, -73.985428);
    //     const mapOptions = {
    //         zoom: 13,
    //         center: myLatlng,
    //         scrollwheel: false, // we disable de scroll over the map, it is a really annoing when you scroll through page
    //         styles: [
    //             {'featureType': 'water', 'stylers': [{'saturation': 43}, {'lightness': -11}, {'hue': '#0088ff'}]},
    //             {'featureType': 'road', 'elementType': 'geometry.fill', 'stylers': [{'hue': '#ff0000'},
    //             {'saturation': -100}, {'lightness': 99}]},
    //             {'featureType': 'road', 'elementType': 'geometry.stroke', 'stylers': [{'color': '#808080'},
    //             {'lightness': 54}]},
    //             {'featureType': 'landscape.man_made', 'elementType': 'geometry.fill', 'stylers': [{'color': '#ece2d9'}]},
    //             {'featureType': 'poi.park', 'elementType': 'geometry.fill', 'stylers': [{'color': '#ccdca1'}]},
    //             {'featureType': 'road', 'elementType': 'labels.text.fill', 'stylers': [{'color': '#767676'}]},
    //             {'featureType': 'road', 'elementType': 'labels.text.stroke', 'stylers': [{'color': '#ffffff'}]},
    //             {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]},
    //             {'featureType': 'landscape.natural', 'elementType': 'geometry.fill', 'stylers': [{'visibility': 'on'},
    //             {'color': '#b8cb93'}]},
    //             {'featureType': 'poi.park', 'stylers': [{'visibility': 'on'}]},
    //             {'featureType': 'poi.sports_complex', 'stylers': [{'visibility': 'on'}]},
    //             {'featureType': 'poi.medical', 'stylers': [{'visibility': 'on'}]},
    //             {'featureType': 'poi.business', 'stylers': [{'visibility': 'simplified'}]}
    //         ]
    //     };
    //     const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //     const Marker = new google.maps.Marker({
    //         position: myLatlng,
    //         title: 'Hello World!'
    //     });
    // // To add the marker to the map, call setMap();
    // Marker.setMap(map);
  }

}
