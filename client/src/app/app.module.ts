import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NguiMapModule} from '@ngui/map';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';

import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FlashMessagesModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { 
        path: "login",
        component: LoginComponent
      },
      { 
        path: "about",
        component: AboutComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "",
        component: HomeComponent
      }
    ]),
    NgbModule.forRoot(),    
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCVRKkMBanRLv3SJzkcc3XaYdGB-4q1_98&libraries=visualization,places,drawing'})
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }
