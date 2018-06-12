import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NguiMapModule} from '@ngui/map';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { JwtModule } from '@auth0/angular-jwt';


import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';

import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GmapsComponent } from './components/home/property/gmaps/gmaps.component';
import { PropertyAreaComponent } from './components/home/property/property-area/property-area.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { PropertyComponent } from './components/home/property/property.component';
import { PropertyDetailsComponent } from './components/home/property-details/property-details.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    NavbarComponent,
    GmapsComponent,
    PropertyAreaComponent,
    DashboardComponent,
    PropertyComponent,
    PropertyDetailsComponent
  ],
  imports: [
    BrowserModule,
    FlashMessagesModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3001'],
        blacklistedRoutes: ['localhost:3001/auth/']
      }
    }),
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
        path: "home",
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "createProperty",
        component: PropertyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "propertyDetails/:propertyName",
        component: PropertyDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "",
         redirectTo: '/home', 
         pathMatch: 'full' ,
      }
    ]),
    NgbModule.forRoot(),    
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCVRKkMBanRLv3SJzkcc3XaYdGB-4q1_98&libraries=visualization,places,drawing'})
  ],
  providers: [AuthService, AuthGuard, NgbActiveModal],
  bootstrap: [AppComponent]
})

export class AppModule { }
