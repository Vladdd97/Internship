import {Component, OnInit, Output} from '@angular/core';
import {Coordinate} from '../../_models/coordinate';
import {UserService} from '../../_services/user/user.service';
import {AlertComponent} from '../alert/alert.component';
import {MatDialog} from '@angular/material';
import {StepperService} from '../../_services/stepper/stepper.service';
import {MapsComponent} from './maps/maps.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  coordinates: Coordinate[] = []; // container with all user personal requests
  coordinatesRequests: Coordinate[] = []; // container with all requests that are going the same way
  coordinatesAllRequests: Coordinate[] = []; // container with all unexpired requests
  private user: string; // will stock username
  private states = ['passenger', 'driver']; // user states
  private statesOffReq = ['offers', 'requests']; // offers or requests states
  private i;
  private offReq;
  private toggle: boolean;
  @Output() state;
  coordinateSearch: any = {};
  notFoundOrEmpty;

  constructor(private userService: UserService,
              public dialog: MatDialog,
              private stepperService: StepperService,
              private map: MapsComponent) {
    this.i = 0;
    this.state = this.states[this.i];
    this.offReq = this.statesOffReq[this.i];
    this.notFoundOrEmpty = false;
  }

  static calculateTime(endTime) {
    const time = new Date(Number(endTime));
    return time.toLocaleTimeString() + ' ' + time.toDateString();
  }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUsername')).username;

    // populate container with all personal requests
    this.showAll();

    // populate container with all non-expired requests
    this.getAllAvailableReq();

    // subscribe to stepper start address and end address fields in order to make a search in all non expired routes
    this.subscribeToAddressNames();

  }

  subscribeToAddressNames() {
    this.stepperService.getCoordinatesStart()
      .subscribe(e => {
          this.coordinateSearch.coordinateStart = e.newCoordinates;
        }, error => {
          console.log(error);
        }
      );

    this.stepperService.getCoordinatesEnd()
      .subscribe(e => {
          this.coordinateSearch.coordinateEnd = e.newCoordinates;
        }, error => {
          console.log(error);
        }
      );
  }

  switch() {
    this.i === 0 ? this.i++ : this.i--;
    this.state = this.states[this.i];
    this.offReq = this.statesOffReq[this.i];
  }

  showAll() {
    if (!this.toggle) {
      this.toggle = !this.toggle;
      this.userService.getAllPersonalUnexpired()
        .subscribe(data => {
            this.coordinates = data;
            this.coordinates = this.optimizeCoordinates(this.coordinates);
          }, error =>
            console.error(error)
        );
    } else {
      this.toggle = !this.toggle;
      this.userService.getAllPersonal()
        .subscribe(data => {
            this.coordinates = data;
            this.coordinates = this.optimizeCoordinates(this.coordinates);
          }, error =>
            console.error(error)
        );
    }
  }

  optimizeCoordinates(coordinates) {
    coordinates.forEach(c => {
      c.endTime = HomeComponent.calculateTime(c.endTime);
    }, error => {
      console.log(error);
    });
    return coordinates;
  }

  optimizeCoordinatesRequests(coordinates) {
    coordinates.forEach(c => {
      c.endTime = HomeComponent.calculateTime(c.endTime);
      this.userService.getUserPhoneNumber(c.id)
        .subscribe(data => {
          c.phoneNumber = data;
        }, error => {
          console.log(error);
        });
    });
    return coordinates;
  }

  sendRequestToSearch() {
    if ((this.coordinateSearch.coordinateStart !== undefined) && (this.coordinateSearch.coordinateStart !== undefined)) {
      this.userService.getRoutesByRequest(this.coordinateSearch)
        .subscribe(data => {
            this.coordinatesRequests = data;
            this.coordinatesRequests = this.optimizeCoordinatesRequests(this.coordinatesRequests);
            if (data.length > 0) {
              const temp = this.coordinatesRequests
                .filter(coordinate => coordinate.forDriver === !(this.state === 'driver'));
              if (temp.length > 0) {
                this.stepperService.setExistingRoutes(true);
                this.notFoundOrEmpty = false;
              } else {
                this.stepperService.setExistingRoutes(false);
              }
            } else {
              this.stepperService.setExistingRoutes(false);
              this.notFoundOrEmpty = true;
            }
          }, error => {
            this.notFoundOrEmpty = true;
            console.log(error);
          }
        );
    } else {
      this.notFoundOrEmpty = true;
    }
  }

  getAllAvailableReq() {
    this.userService.getAllUnexpired()
      .subscribe(data => {
        this.coordinatesAllRequests = data;
        this.coordinatesAllRequests = this.optimizeCoordinatesRequests(this.coordinatesAllRequests);
      }, error => {
        console.log(error);
      });
  }

  delete(e, id) {
    this.userService.delete(id)
      .subscribe(() => {
          this.showAll();
        }, error =>
          console.error(error)
      );
  }

  update(e, coordinate) {
    this.openDialog(coordinate);
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '350px',
      data: {data}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userService.update(result.data.id, result.data)
        .subscribe(() =>
            this.showAll(),
          error =>
            console.log(error));
    });
  }


  filterCoordinatesByState(stateFilter) {
    if (stateFilter) {
      return this.coordinates
        .filter(coordinate => coordinate.forDriver === (this.state === 'driver'));
    } else {
      return this.coordinatesRequests
        .filter(coordinate => coordinate.forDriver === !(this.state === 'driver'));
    }
  }

  returnAllExistingRoutes() {
    return this.coordinatesAllRequests
      .filter(coordinate => coordinate.forDriver === !(this.state === 'driver'));
  }

  setMapDirection(start, end) {
    this.map.setMapDirection(end.split(':'), start.split(':'));
  }

}
