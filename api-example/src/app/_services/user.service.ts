import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {Coordinate} from '../_models/coordinate';

import 'rxjs/add/operator/map';
import {User} from '../_models/user';

@Injectable()
export class UserService implements OnInit {
  private uid;
  private url = 'http://localhost:8080';

  constructor(private http: HttpClient, private authentificationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  getAllUnexpired() {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.get<Coordinate[]>(this.url + '/users/' + this.uid + '/availableAllRoutes');
  }

  getAll() {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.get<Coordinate[]>(this.url + '/users/' + this.uid + '/coordinates');
  }

  update(id, body) {
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.put(this.url + '/users/' + this.uid + '/coordinates/' + id, body, {
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
    console.log('this is create coord');
    this.uid = JSON.parse(localStorage.getItem('currentUserID')).userID;
    return this.http.post(this.url + '/users/' + this.uid + '/coordinates', coordinate, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

}
