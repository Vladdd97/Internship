import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class StepperService {

  private coordinateStart = new Subject<any>();

  private coordinateEnd = new Subject<any>();

  private routesExist = new Subject<any>();

  constructor() {
  }

  setCoordinatesStart(newAddress, newCoordinates) {
    this.coordinateStart.next({newAddress: newAddress, newCoordinates: newCoordinates});
  }

  getCoordinatesStart() {
    return this.coordinateStart.asObservable();
  }

  setCoordinatesEnd(newAddress, newCoordinates) {
    this.coordinateEnd.next({newAddress: newAddress, newCoordinates: newCoordinates});
  }

  getCoordinatesEnd() {
    return this.coordinateEnd.asObservable();
  }

  setExistingRoutes(value) {
    this.routesExist.next(value);
  }

  getExistingRoutes() {
    return this.routesExist.asObservable();
  }

}
