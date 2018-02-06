import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
        data => {
          console.log('Registration successful! User ' + data + ' successfully created!');
          this.router.navigate(['/login']);
        },
        error => {
          console.error(error.status);
          this.loading = false;
        });
  }

}
