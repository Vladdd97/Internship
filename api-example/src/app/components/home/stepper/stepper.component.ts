import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../_services/user/user.service';
import {StepperService} from '../../../_services/stepper/stepper.service';

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
  @ViewChild('message') message;
  @Output() triggerRequest = new EventEmitter<any>();

  // messageShow = true;

  constructor(private _formBuilder: FormBuilder,
              private userService: UserService,
              private stepperService: StepperService) {
  }

  ngOnInit() {
    this.stepperInit();
    this.stepperService.getCoordinatesStart()
      .subscribe(e => {
          this.coordinate.addressStart = e.newAddress;
          this.coordinate.coordinateStart = e.newCoordinates;
          this.addressStart.nativeElement.value = e.newAddress;
          // this.messageShow.start = true;
        }, error => {
          console.log(error);
        }
      );

    this.stepperService.getCoordinatesEnd()
      .subscribe(e => {
          this.coordinate.addressEnd = e.newAddress;
          this.coordinate.coordinateEnd = e.newCoordinates;
          this.addressEnd.nativeElement.value = e.newAddress;
          // this.messageShow = true;
          this.checkIfRequestExists();
        }, error => {
          console.log(error);
        }
      );

  }

  checkIfRequestExists = () => {
    this.triggerRequest.next();
    this.stepperService.getExistingRoutes()
      .subscribe( e => {
        this.message.nativeElement.hidden = false;
      });
  };


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
    }
  }

  stepperInit() {
    this.message.nativeElement.hidden = true;
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
    console.log(this.coordinate);
    this.userService.createCoordinate(this.coordinate)
      .subscribe(data => {
          this.clearValues();
          this.stepperInit();
        },
        error => {
          console.error(error.status);
        });
  }

  clearValues() {
    this.stepper.selectedIndex = 0;
    this.coordinate = {};
    this.addressEnd.nativeElement.value = '';
    this.addressStart.nativeElement.value = '';
  }


}
