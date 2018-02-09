import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../_services/user/user.service';
import {StepperService} from '../../../_services/stepper/stepper.service';
import {MapsComponent} from '../maps/maps.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit, OnChanges {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  coordinate: any = {};
  @Input() state;
  @ViewChild('coordinate.addressStart') addressStart;
  @ViewChild('coordinate.addressEnd') addressEnd;
  @ViewChild('stepper') stepper;
  @ViewChild('messageSuccess') messageSuccess;
  @ViewChild('messageDanger') messageDanger;
  @Output() triggerRequest = new EventEmitter<any>();

  constructor(private _formBuilder: FormBuilder,
              private userService: UserService,
              private stepperService: StepperService,
              private map: MapsComponent) {
  }

  ngOnInit() {

    this.stepperInit();

    this.subscribeToCoordinatesFromMap();

  }

  subscribeToCoordinatesFromMap() {
    this.stepperService.getCoordinatesStart()
      .subscribe(e => {
          this.coordinate.addressStart = e.newAddress;
          this.coordinate.coordinateStart = e.newCoordinates;
          this.addressStart.nativeElement.value = e.newAddress;
        }, error => {
          console.log(error);
        }
      );

    this.stepperService.getCoordinatesEnd()
      .subscribe(e => {
          this.coordinate.addressEnd = e.newAddress;
          this.coordinate.coordinateEnd = e.newCoordinates;
          this.addressEnd.nativeElement.value = e.newAddress;
          this.checkIfRequestExists();
        }, error => {
          console.log(error);
        }
      );

  }

  checkIfRequestExists = () => {
    this.triggerRequest.next();
    this.stepperService.getExistingRoutes()
      .subscribe((response) => {
        if (response) {
          this.messageDanger.nativeElement.hidden = true;
          this.messageSuccess.nativeElement.hidden = false;
        } else {
          this.messageSuccess.nativeElement.hidden = true;
          this.messageDanger.nativeElement.hidden = false;
        }
      });
  }// ;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
    }
  }

  stepperInit() {
    this.removeAlerts();
    this.clearValues();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      firstCtrl2: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  sendRequest() {
    this.coordinate.startTime = new Date().getTime();
    this.coordinate.endTime = this.coordinate.startTime + this.coordinate.lifeTime * 60 * 1000;
    this.coordinate.forDriver = this.state === 'driver';
    this.userService.createCoordinate(this.coordinate)
      .subscribe(() => {
        this.stepperInit();
        this.map.clearDirections();
      }, error => {
        console.error(error.status);
      });
  }

  clearValues() {
    this.stepper.selectedIndex = 0;
    this.coordinate = {};
    this.addressEnd.nativeElement.value = '';
    this.addressStart.nativeElement.value = '';
  }


  removeAlerts() {
    this.messageSuccess.nativeElement.hidden = true;
    this.messageDanger.nativeElement.hidden = true;
  }
}
