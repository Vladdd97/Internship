import {Component, Input, OnInit} from '@angular/core';
import {Coordinate} from '../../_models/coordinate';
import {UserService} from '../../_services/user.service';
import {MapsComponent} from './maps/maps.component';
import {AlertComponent} from '../alert/alert.component';
import {MatDialog} from '@angular/material';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  coordinates: Coordinate[] = [];
  user: string;


  constructor(private userService: UserService,
              private maps: MapsComponent,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUsername')).username;
    this.showAll();

  }

  showAll() {
    this.userService.getAllUnexpired()
      .subscribe(data => {
          this.coordinates = data;
        }, error =>
          console.error(error)
      );
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
    console.log('Update functionality!');
    this.openDialog(coordinate);
  }

  addNew() {
    console.log('Add new coordinate');
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: { data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  setMapDirection(e, coordinate) {
    const startPoint = coordinate.coordinateStart.split(':');
    const endPoint = coordinate.coordinateEnd.split(':');
    this.maps.setMapDirection(startPoint, endPoint);
  }

  calculateTime(endTime) {
    const time = new Date(Number(endTime));
    return time.toDateString();
  }

}
