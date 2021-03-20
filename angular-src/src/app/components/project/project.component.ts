import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';


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
  demoUrl:String,
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


  constructor(    
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.title = this.route.snapshot.paramMap.get('title');
 
    this.authService.getProject(this.username, this.title).subscribe(proj => {
      this.project = proj.project;
    },
    err => {
      return false;
    });

  }

}
