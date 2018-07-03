import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NguiMapModule} from '@ngui/map';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxPermissionsModule, NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from './components/home/calendar/calendar-utils/module';

import { AuthGuard } from './providers/auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';

import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { PropertyComponent } from './components/home/property/property.component';
import { PropertyDetailsComponent } from './components/home/property-details/property-details.component';

import { Data } from './providers/data';
import { FooterComponent } from './components/footer/footer.component';
import { CalendarComponent } from './components/home/calendar/calendar.component';
import { PointFormComponent } from './components/home/property-details/point-form/point-form.component';

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
    DashboardComponent,
    PropertyComponent,
    PropertyDetailsComponent,
    FooterComponent,
    CalendarComponent,
    PointFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,    
    FormsModule,
    DemoUtilsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    CalendarModule.forRoot(),
    FlashMessagesModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3001'],
        blacklistedRoutes: ['localhost:3001/auth/']
      }
    }),
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
        path: "map",
        component: PropertyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "map/:name",
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
      },
      {
        path: '**', 
        component: HomeComponent
      }

    ]),
    NgbModule.forRoot(),    
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCVRKkMBanRLv3SJzkcc3XaYdGB-4q1_98&libraries=visualization,places,drawing'})
  ],
  providers: [
          AuthService, 
          AuthGuard, 
          Data, 
          NgbActiveModal,
          {
            provide: APP_INITIALIZER,
            useFactory: (dt: Data, ps:NgxPermissionsService) => function()
            { 
              if (dt) {                  
                console.log(ps);
                return ps.loadPermissions(dt.getAllPermissions())                                     
              }             
            },
            multi: true,
            deps: [Data, NgxPermissionsService]
          },
          {
            provide: APP_INITIALIZER,
            useFactory: (dt: Data, rs:NgxRolesService) => function()
            { 
              var role = localStorage.getItem('role');
              if (role) {                  
                console.log(role);
                if (role == "ADMIN") {
                  return rs.addRole(role, dt.getPropertyOwnerPermissions())
                } else if (role == "TECHNICIAN") {
                  return rs.addRole(role, dt.getTechnicianPermissions())
                }
                
              }             
            },
            multi: true,
            deps: [Data, NgxRolesService]
          }],
  bootstrap: [AppComponent]
})

export class AppModule { }
