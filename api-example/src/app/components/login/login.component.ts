import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;

  constructor(private router: Router,
              private authentificationService: AuthenticationService) {
  }

  ngOnInit() {
    AuthenticationService.logout();
  }

  login() {
    this.loading = true;
    this.authentificationService.login(this.model.username, this.model.password)
      .subscribe(result => {
          if (result) {
            this.router.navigate(['/']);
          } else {
            this.loading = false;
          }
        }, error => {
        this.loading = false;
        window.alert(`${error.status}: ${error.error.message}`);
        }
      );
  }
}
