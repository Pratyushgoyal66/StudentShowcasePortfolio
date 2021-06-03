import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Observable, of, OperatorFunction} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, tap, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  projectsArray;
  displayProjects;
  projects = new Array();
  tags = new Array();
  selectedTags;
  filtered = false;
  currentRating;



constructor(    
  private flashMessage: FlashMessagesService,
  public authService: AuthService,
  private router: Router,
  private route: ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.authService.advancedSearch().subscribe(projectsArray => {
      if(projectsArray.data){
        this.projectsArray = projectsArray.projects;
        this.rate();
        this.displayProjects = this.projects.slice(0);
      }
      else{
        this.flashMessage.show('No Projects found in database', {cssClass: 'alert-danger', timeout:3000});
      }
    });

  }

  rate(){

    for (var i in this.projectsArray){
      var review: any = {
        'totalRating': 0,
        'totalReviews': 0
      };
      var reviewer = this.projectsArray[i].rating.aggRating.reviewer;
      if(reviewer.length > 0){
        for(var j in reviewer){
          review.totalRating += reviewer[j].rated;
          review.totalReviews += 1;
        }
      }
      var total = 0
      if(review.totalRating == 0 || review.totalReviews == 0){
        total = 0;
      }
      else {
        total = review.totalRating/review.totalReviews;
      }
      var project = {
        'title': this.projectsArray[i].title,
        'author': this.projectsArray[i].author,
        'authorUsername': this.projectsArray[i].authorUsername,
        'rating' : total,
        'tags': this.projectsArray[i].tags.toString(),
        'searchingTags': this.projectsArray[i].tags
      }
      for(var z in this.projectsArray[i].tags){
        if(!this.tags.includes(this.projectsArray[i].tags[z])){
          this.tags.push(this.projectsArray[i].tags[z]);
        }
      }
      this.projects.push(project);
    }
  }

  filter(rating){
    if(this.currentRating != rating){
      this.displayProjects = this.projects.filter(proj => proj.rating == rating);
      this.currentRating = rating;
    }
    else{
      this.currentRating = rating;
      this.displayProjects = this.displayProjects.filter(proj => proj.rating == rating);
      this.filtered = true;
    }
  }

  select(){
    if (!this.selectedTags.length){
      if(!this.filtered){
        this.reset();
      }
      else{
        this.displayProjects = this.projects.filter(proj => proj.rating == this.currentRating);
      }
    }
    else{
      for(var i in this.selectedTags){
        this.displayProjects = this.displayProjects.filter(proj => proj.searchingTags.includes(this.selectedTags[i]));
      }
    }
  }

  reset(){
    this.selectedTags = [];
    this.displayProjects = this.projects.slice(0);
    this.filtered = false;
  }

}
