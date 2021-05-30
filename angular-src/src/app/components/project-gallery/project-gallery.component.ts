import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-project-gallery',
  templateUrl: './project-gallery.component.html',
  styleUrls: ['./project-gallery.component.css']
})
export class ProjectGalleryComponent implements OnInit {
  navigationSubscription;
  username: String;
  projectGal: Array<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.route.params.subscribe(parameter => {
          this.username = parameter.username;
        });
        this.initialiseInvites();
      }
    });

  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.authService.getProjectGallery(this.username).subscribe(projGal => {
      this.projectGal = projGal;
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
    this.projectGal = null;
    this.authService.getProjectGallery(this.username).subscribe(projGal => {
      this.projectGal = projGal;
    },
    err => {
      return false;
    });

  }


}
