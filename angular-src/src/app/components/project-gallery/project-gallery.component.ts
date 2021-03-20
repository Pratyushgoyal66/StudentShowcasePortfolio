import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-project-gallery',
  templateUrl: './project-gallery.component.html',
  styleUrls: ['./project-gallery.component.css']
})
export class ProjectGalleryComponent implements OnInit {
  username: String;
  projectGal: Array<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.authService.getProjectGallery(this.username).subscribe(projGal => {
      this.projectGal = projGal;
    },
    err => {
      return false;
    });

  }


}
