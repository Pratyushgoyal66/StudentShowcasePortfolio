import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormGroup, FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  project;
  projectData;
  username;
  title;
  projForm;

  constructor(    
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  getProject() {
    // Function to GET project from database
    this.project = this.authService.getProject(this.username, this.title).pipe((tap(proj => this.projForm.patchValue(proj.project))));

  }

  initializeProject(){
    this.projForm = new FormGroup({
      body: new FormGroup({
        shortDescription: new FormControl(''),
        description: new FormControl(''),
        workedWith: new FormControl(''),
        workedUnder: new FormControl(''),
        inspiration: new FormControl(''),
        challenges: new FormControl('') 
      }),
      repo : new FormControl(''),
      demoId: new FormControl('') ,
      tags: new FormControl('')
    });
  }

  onSubmitEditProjectValues(){
    const rawProj = this.projForm.getRawValue();
    let project = {
      body: {
        shortDescription: String,
        description: String,
        workedWith: String,
        workedUnder: String,
        inspiration: String, 
        challenges: String
      },
      repo: String,
      demoId: String,
      tags: Array,
    };     
    var tags;
    project.body = rawProj.body;
    project.repo = rawProj.repo;
    project.demoId = rawProj.demoId;
    tags = rawProj.tags.toString().toLowerCase().split(', '); 
    project.tags = tags.toString().split(',');

    //update project
    this.authService.editProject(this.projectData._id, project, this.username, this.title).subscribe(response => {
      if(response.updated){
        this.flashMessage.show("Projected Updated", {cssClass: 'alert-success', timeout:3000});
        this.router.navigate([this.username, 'project', this.title]);
      }
      else{
        this.flashMessage.show("Something went wrong", {cssClass: 'alert-danger', timeout:3000});
        this.router.navigate([this.username, 'project', this.title]);
      }
    })
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.title = this.route.snapshot.paramMap.get('title');
    if(this.authService.getCurrentUser() != this.username){
      this.flashMessage.show("You don't have permission to view this page", {cssClass: 'alert-danger', timeout:3000});
      this.router.navigate([this.authService.getCurrentUser()]);
    }
    this.authService.getProject(this.username, this.title).subscribe(proj => {
      this.projectData = proj.project;
    },
    err => {
      return false;
    });
    this.initializeProject();
    this.getProject();
  }

}
