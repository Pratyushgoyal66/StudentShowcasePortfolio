import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectGalleryComponent } from '../project-gallery/project-gallery.component';


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

  navigationSubscription;
  user: User;
  username: String;
  private sub: any;

  constructor(    
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private projGalComp: ProjectGalleryComponent
    ) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });

     }

  ngOnInit(){
    this.username = this.route.snapshot.paramMap.get('username');
    this.authService.getAnyProfile(this.username).subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      return false;
    });
    
  }
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  initialiseInvites() {
    this.username = this.route.snapshot.paramMap.get('username');
    this.authService.getAnyProfile(this.username).subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      return false;
    });
  }

}
