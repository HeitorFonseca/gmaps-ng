import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  username:string;

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { 
    
    
  }


  // Function to logout user
  onLogoutClick() {
    this.authService.logout(); // Logout user
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert-info' }); // Set custom flash message
    //this.router.navigate(['/']); // Navigate back to home page
  }

  ngOnInit() {
    let obj = JSON.parse(localStorage.getItem('user'));
    console.log(obj);
    if (obj) {
      this.username = obj.username;
    }
  }

}
