import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import {Observable} from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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
    demoUrl: new FormControl('') 
  });

  constructor(
    private validateService: ValidateService, 
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router) { }


  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.projForm.controls.author['controls'].value = profile.user.username;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  onAddSubmit() {
    const rawProj = this.projForm.getRawValue();
    let project = {
      _author: String,
      body : {
        shortDescription: String,
        description: String,
        workedWith: String,
        workedUnder: String,
        inspiration: String, 
        challenges: String
      },
      repo: String,
      demoUrl: String
    };
    project._author = rawProj.author;
    project.body = rawProj.body;
    project.repo = rawProj.repo;
    project.demoUrl = rawProj.demoUrl;
  }

}


