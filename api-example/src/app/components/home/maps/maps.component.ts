import {Component, OnInit} from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  private map;
  private directionsService;
  private directionsDisplay;

  constructor() {
  }

  ngOnInit() {
    this.mapInit();
  }

  mapInit() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 47.00989485019684, lng: 28.840969763696194},
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      disableDoubleClickZoom: true,
      zoomControl: false,
    });
    return this.map;
  }

  setMapDirection(coordinate) {
    console.log('got in to the method');
    // got our coordinates object start and end points
    const startPoint = coordinate.coordinateStart.split(':');
    const endPoint = coordinate.coordinateEnd.split(':');

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.mapInit());
    calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
      directionsService.route({
        origin: new google.maps.LatLng(parseFloat(startPoint[1]), parseFloat(startPoint[0])),
        destination: new google.maps.LatLng(parseFloat(endPoint[1]), parseFloat(endPoint[0])),
        travelMode: 'DRIVING'
      }, function (response, status) {
        if (status === 'OK') {
          console.log('success');
          console.log(response);
          directionsDisplay.setDirections(response);
        } else {
          console.log('success');
          window.alert('Error: ' + status);
        }
      });
    }
  }
}
