import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Coordinate} from '../../_models/coordinate';
import {UserService} from '../../_services/user/user.service';
import {MapsComponent} from './maps/maps.component';
import {AlertComponent} from '../alert/alert.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  coordinates: Coordinate[] = [];
  private user: string;
  private states = ['passenger', 'driver'];
  private statesOffReq = ['offers', 'requests'];
  private i;
  private offReq;
  private toggle: boolean;
  @Output() state;

  constructor(private userService: UserService,
              public dialog: MatDialog) {
    this.i = 0;
    this.state = this.states[this.i];
    this.offReq = this.statesOffReq[this.i];
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUsername')).username;
    this.showAll();
  }

  switch() {
    this.i === 0 ? this.i++ : this.i--;
    this.state = this.states[this.i];
    this.offReq = this.statesOffReq[this.i];
  }

  showAll() {
    if (!this.toggle) {
      this.toggle = !this.toggle;
      this.userService.getAllUnexpired()
        .subscribe(data => {
            this.coordinates = data;
          }, error =>
            console.error(error)
        );
    } else {
      this.toggle = !this.toggle;
      this.userService.getAll()
        .subscribe(data => {
            this.coordinates = data;
          }, error =>
            console.error(error)
        );
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
      console.log('The dialog was closed');
      this.userService.update(result.data.id, result.data)
        .subscribe(dat =>
            this.showAll(),
          error =>
            console.log(error));
    });
  }

  calculateTime(endTime) {
    const time = new Date(Number(endTime));
    return time.toDateString();
  }

}
