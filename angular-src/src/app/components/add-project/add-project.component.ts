import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import {Observable} from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  projForm = new FormGroup({
    author: new FormControl(''),
    title: new FormControl(''),
    body: new FormGroup({
      shortDescription: new FormControl(''),
      description: new FormControl(''),
      workedWith: new FormControl(''),
      workedUnder: new FormControl(''),
      inspiration: new FormControl(''),
      challenges: new FormControl('') 
    }),
    repo : new FormControl(''),
    demoId: new FormControl('') 
  });

  constructor(
    private validateService: ValidateService, 
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router) { }


  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.projForm.controls['author'].setValue(profile.user.username);
    },
    err => {
      console.log(err);
      return false;
    });

  }

  onAddSubmit() {
    const rawProj = this.projForm.getRawValue();
    let project = {
      author: String,
      title: String,
      body : {
        shortDescription: String,
        description: String,
        workedWith: String,
        workedUnder: String,
        inspiration: String, 
        challenges: String
      },
      repo: String,
      demoId: String,
    };
    project.author = rawProj.author;
    project.title = rawProj.title;
    project.body = rawProj.body;
    project.repo = rawProj.repo;
    project.demoId = rawProj.demoId;


    //addProject
    this.authService.addProject(project).subscribe(data => {
      if(data.success){
        
        this.flashMessage.show('Your Project Added Successfully!!', {cssClass: 'alert-success', timeout:3000});
        this.router.navigate([project.author]);
      } else{
        this.flashMessage.show('Something went wrong!', {cssClass: 'alert-danger', timeout:3000});
        this.router.navigate([project.author]);
      }
    });
  }

}


