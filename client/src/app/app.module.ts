import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
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
import { ProfileComponent } from './components/home/profile/profile.component';
import { Profile } from 'selenium-webdriver/firefox';


import { TokenInterceptor } from './services/token-interceptor';
import { UserRegisterComponent } from './components/user-register/user-register.component'



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
    PointFormComponent,
    ProfileComponent,
    UserRegisterComponent
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
        path: "register",
        component: UserRegisterComponent
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
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "",
         redirectTo: '/home', 
         pathMatch: 'full' ,
      },
      {
        path: '**', 
        component: AboutComponent
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
            provide: HTTP_INTERCEPTORS, 
            useClass: TokenInterceptor, 
            multi: true 
          },
          {
            provide: APP_INITIALIZER,
            useFactory: (dt: Data, ps:NgxPermissionsService) => function()
            { 
              
              if (userObj && dt) { 
                var userObj = JSON.parse(localStorage.getItem('user'));
                console.log("GET ROLE:", userObj.tipo);                               

                var arr = new Array<any>();
                arr.push(userObj.tipo);
                                
                return ps.loadPermissions(arr)
                
              }             
            },
            multi: true,
            deps: [Data, NgxPermissionsService]
          }],
  bootstrap: [AppComponent]
})

export class AppModule { }
