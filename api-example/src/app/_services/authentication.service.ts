import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  public token: string;
  public userID: string;

  constructor(private http: HttpClient) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  static logout(): void {
    localStorage.clear();
  }

  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:8080/login', {username: username, password: password}, {observe: 'response'})
      .map(res => {
          const token = res.headers.get('Authorization');
          const userID = res.headers.get('UserID');
          if (token) {
            this.token = token;
            this.userID = userID;
            localStorage.setItem('currentUser', JSON.stringify({token: token}));
            localStorage.setItem('currentUserID', JSON.stringify({userID: userID}));
            localStorage.setItem('currentUsername', JSON.stringify({username: username}));
            return true;
          }
          return false;

        }, msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
      );
  }


}
