import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// ------------------- OUR OWN COMPONENTS ------------------------- //
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MapsComponent } from './components/home/maps/maps.component';
import { AlertComponent } from './components/alert/alert.component';
import { StepperComponent } from './components/home/stepper/stepper.component';
import { StepperService } from './_services/stepper/stepper.service';

import { AuthenticationService } from './_services/authentification/authentication.service';
import { UserService } from './_services/user/user.service';
import { AuthGuard } from './_guards/auth.guard';
import { AuthInterceptor} from './_interceptors/auth.service';
import { routing } from './app.routing';

// ------------------ OTHER IMPORTS --------------------- //
import { FormsModule, ReactiveFormsModule, Form } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

// ------------------- MAT DESIGN IMPORTS ------------------------- //
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatExpansionModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule} from '@angular/material';
import { MatStepperModule,  } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MapsComponent,
    AlertComponent,
    StepperComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSlideToggleModule
  ],
  entryComponents: [AlertComponent],
  providers: [
    AppComponent,
    MapsComponent,
    AuthGuard,
    AuthenticationService,
    UserService,
    StepperComponent,
    StepperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
