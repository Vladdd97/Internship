import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Coordinate} from '../../_models/coordinate';

import 'rxjs/add/operator/map';
import {User} from '../../_models/user';

@Injectable()
export class UserService implements OnInit {
  private uid;
  private url = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  getAllUnexpired() {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.get<Coordinate[]>(this.url + '/users/' + this.uid + '/availableAllRoutes', {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getRoutesByRequest(coordinate) {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.post<Coordinate[]>(this.url + '/users/' + this.uid + '/request', {
      startCoordinate: coordinate.coordinateStart,
      endCoordinate: coordinate.coordinateEnd
    });
  }

  getAllPersonalUnexpired() {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.get<Coordinate[]>(this.url + '/users/' + this.uid + '/availablePersonalRoutes', {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllPersonal() {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.get<Coordinate[]>(this.url + '/users/' + this.uid + '/coordinates');
  }

  update(id, coordinate) {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.put(this.url + '/users/' + this.uid + '/coordinates/' + id, coordinate, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(id: number) {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.delete(this.url + '/users/' + this.uid + '/coordinates/' + id);
  }

  create(user: User) {
    return this.http.post(this.url + '/users/sign-up', user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    });
  }

  createCoordinate(coordinate: Coordinate) {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.post(this.url + '/users/' + this.uid + '/coordinates', coordinate, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getUserPhoneNumber(id) {
    return this.http.post(this.url + '/users/phoneNumber', {coordinateId: id});
  }

}
