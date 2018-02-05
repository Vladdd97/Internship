import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

declare let google: any;

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  public map;
  private directionsService;
  private directionsDisplay;
  private markers: any[] = [];
  coordinate: any = {
    addressStart: '',
    addressEnd: '',
  };
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.mapInit();
    this.stepperInit();
  }

  stepperInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  mapInit() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 47.00989485019684, lng: 28.840969763696194}
      // scrollwheel: false,
      // navigationControl: false,
      // mapTypeControl: false,
      // scaleControl: false,
      // draggable: false,
      // disableDoubleClickZoom: true,
      // zoomControl: false,
    });

    this.map.addListener('click', e => {
      this.addNewMarker(e.latLng.lat(), e.latLng.lng());
    });
    return this.map;
  }

  setMapDirection(startPoint, endPoint) {
    // got our coordinates object start and end points
    // const startPoint = coordinate.coordinateStart.split(':');
    // const endPoint = coordinate.coordinateEnd.split(':');
    console.log(startPoint);
    console.log(endPoint);
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
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Error: ' + status);
        }
      });
    }
  }

  addNewMarker(lat, lng) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: this.map,
      animation: google.maps.Animation.BOUNCE
    });
    this.markers.push(marker);
    this.addAllMarkersOnMap(this.map);
    this.geocodePosition(marker);
    if (this.markers.length > 1) {
      console.log(this.markers[0].getPosition().lat());
      console.log(this.markers[0].getPosition().lng());
      console.log(this.markers[1].getPosition().lat());
      console.log(this.markers[1].getPosition().lng());
      this.setMapDirection(
        [this.markers[0].getPosition().lng(), this.markers[0].getPosition().lat()],
        [this.markers[1].getPosition().lng(), this.markers[1].getPosition().lat()]);
      this.clearMarkers();
    }
  }

  addAllMarkersOnMap(map) {
    for (const m of this.markers) {
      m.setMap(map);
    }
  }

  clearMarkers() {
    this.addAllMarkersOnMap(null);
    this.markers = [];
  }

  geocodePosition(marker) {
    const geocoder = new google.maps.Geocoder();
    let address = '';
    geocoder.geocode({
      latLng: marker.getPosition()
    }, function (response) {
      if (response && response.length > 0) {
        address = response[0].formatted_address;
        console.log(address);
      }
    });
    if (this.markers.length === 1) {
      this.coordinate.addressStart = address;
    }
    if (this.markers.length === 2) {
      this.coordinate.addressEnd = address;
    }
  }

  sendRequest() {

    this.coordinate.startTime = new Date().getTime();
    this.coordinate.endTime = this.coordinate.startTime + this.coordinate.lifeTime * 60 * 1000;

    console.log(this.coordinate);
    // this.userService.createCoordinate(this.coordinate)
    //   .subscribe(
    //     data => {
    //       console.log('Sent!');
    //       console.log(data);
    //     },
    //     error => {
    //       console.error(error.status);
    //     });

  }
}
