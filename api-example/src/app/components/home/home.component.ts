import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {Coordinate} from '../../_models/coordinate';
import {UserService} from '../../_services/user/user.service';
import {AlertComponent} from '../alert/alert.component';
import {MatDialog} from '@angular/material';
import {StepperService} from '../../_services/stepper/stepper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  coordinates: Coordinate[] = [];
  coordinatesRequests: Coordinate[] = [];
  private user: string;
  private states = ['passenger', 'driver'];
  private statesOffReq = ['offers', 'requests'];
  private i;
  private offReq;
  private toggle: boolean;
  @Output() state;
  coordinateSearch: any = {};
  notFoundOrEmpty;

  constructor(private userService: UserService,
              public dialog: MatDialog,
              private stepperService: StepperService) {
    this.i = 0;
    this.state = this.states[this.i];
    this.offReq = this.statesOffReq[this.i];
    this.notFoundOrEmpty = false;
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUsername')).username;
    this.showAll();

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
          }, error =>
            console.error(error)
        );
    } else {
      this.toggle = !this.toggle;
      this.userService.getAllPersonal()
        .subscribe(data => {
            this.coordinates = data;
          }, error =>
            console.error(error)
        );
    }

  }

  showToConsole(text) {
    //console.log(text);
  }

  sendRequestToSearch() {
    if ((this.coordinateSearch.coordinateStart !== undefined) && (this.coordinateSearch.coordinateStart !== undefined)) {
      this.userService.getRoutesByRequest(this.coordinateSearch)
        .subscribe(data => {
            console.log(data);
            this.coordinatesRequests = data;
          }
          , error => {
            this.notFoundOrEmpty = true;
            console.log(error);
          }
        );
    } else {
      this.notFoundOrEmpty = true;
      console.log('some parameters might be missing');
    }

  }

  delete(e, id) {
    this.userService.delete(id)
      .subscribe(data => {
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
        .subscribe(dat =>
            this.showAll(),
          error =>
            console.log(error));
    });
  }

  calculateTime(endTime) {
    const time = new Date(Number(endTime));
    return time.toTimeString();
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

}
