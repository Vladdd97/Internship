import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ( JSON.parse(localStorage.getItem('currentUser')) != null) {
      req = req.clone({
        setHeaders: {
          Authorization: JSON.parse(localStorage.getItem('currentUser')).token
        }
      });
    }
    return next.handle(req);
  }
}
