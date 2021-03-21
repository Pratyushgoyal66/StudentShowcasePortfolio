import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

interface User {
  name: String,
  username: String,
  email: String
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  username: String;
  private sub: any;

  constructor(    
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(){
    this.username = this.route.snapshot.paramMap.get('username');
    this.authService.getAnyProfile(this.username).subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      return false;
    });

  }

}
