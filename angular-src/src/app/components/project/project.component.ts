import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


interface Project{
  _author: String,
  title: String,
  body: {
    shortDescription:String,
    description:String,
    workedWith:String,
    workedUnder:String,
    inspiration:String,
    challenges:String,
  }
  repo:String,
  demoId:String,
  rating: {
    aggRating:String,
    teachRating:String,
    githubStars:String,
  }
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project: Project;
  username: String;
  title: String;
  private sub: any;
  safeUrl:any;


  constructor(    
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.title = this.route.snapshot.paramMap.get('title');
 
    this.authService.getProject(this.username, this.title).subscribe(proj => {
      this.project = proj.project;
      var tempUrl = "https://www.youtube.com/embed/" + this.project.demoId;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tempUrl);


    },
    err => {
      return false;
    });

  }
  


 

}

