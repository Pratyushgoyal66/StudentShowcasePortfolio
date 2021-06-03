import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project;
  username: String;
  title: String;
  safeUrl:any;
  commentForm;
  processing = false;
  newComment = [];
  enabledComments = [];
  loadingProject = false;
  currentRate;
  reviewer: any = {
    'totalRating': 0,
    'totalReviews': 0
  };


  constructor(    
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder
    ) {
      this.createCommentForm(); // Create form for posting comments on a user's blog post
     }


  onDelete(){
    if(confirm("Are you sure to delete "+ this.title)) {
      this.authService.deleteProject(this.username, this.title).subscribe(data => {
        if(data){
          this.router.navigate([this.username]);
          this.flashMessage.show('Deletion Successfull', {cssClass: 'alert-success', timeout:3000});
        }
        else{
          this.flashMessage.show('Deletion Not Successfull', {cssClass: 'alert-danger', timeout:3000});
        }
      });
    }
  }
  
  // Create form for posting comments
  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })
  }

  // Enable the comment form
  enableCommentForm() {
    this.commentForm.get('comment').enable(); // Enable comment field
  }

  // Disable the comment form
  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Disable comment field
  }

  // Reload Project on current page
  reloadProject() {
    this.loadingProject = true; // Used to lock button
    this.getProject(); 
    setTimeout(() => {
      this.loadingProject = false; // Release button lock after four seconds
    }, 4000);
  }

  // Function to post a new comment on blog post
  draftComment(id) {
    this.commentForm.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id); // Add the post that is being commented on to the array
  }

  // Function to cancel new post transaction
  cancelSubmission(id) {
    const index = this.newComment.indexOf(id); // Check the index of the blog post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }

  // Function to get all blogs from the database
  getProject() {
    // Function to GET project from database
    this.authService.getProject(this.username, this.title).subscribe(proj => {
      this.project = proj.project;
      var tempUrl = "https://www.youtube.com/embed/" + this.project.demoId;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tempUrl);
      var reviewer = proj.project.rating.aggRating.reviewer;
        for (var i in reviewer){
          this.reviewer.totalReviews += 1;
          this.reviewer.totalRating += reviewer[i].rated
        }
        if(this.reviewer.totalRating == 0 ||  this.reviewer.totalReviews == 0){
          this.currentRate = 0;
        }
        else{
          this.currentRate = this.reviewer.totalRating / this.reviewer.totalReviews;;
        }
    },
    err => {
      return false;
    });
  }

  // Function to post a new comment
  postComment(id) {
    console.log(this.authService.getCurrentUserId());
    this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.authService.postComment(this.project._id, this.authService.getCurrentUserId(), comment).subscribe(data => {
      this.getProject(); // Refresh all Project to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the project id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  //Delete Comment
  deleteComment(i){
    var commentData = this.project.comments[i];
    if(commentData.commentator != this.authService.getCurrentUser() && this.authService.getCurrentUser() != this.username){
      this.flashMessage.show("You don't have permission to delete this comment", {cssClass: 'alert-danger', timeout:3000});
    }
    else{
      var deleteComment = {
        commentMeta: {
          'projId': this.project._id,
          'comment': commentData.comment,
          'commentator': commentData.commentator
        }
      }
      this.authService.deleteComment(deleteComment).subscribe(deleted => {
        if(deleted){
          this.project.comments.splice(i, 1);
        }
        else{
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-success', timeout:3000});
        }
      });
    }
  }

  // Expand the list of comments
  expand(id) {
    this.enabledComments.push(id); // Add the current id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
  }

  checkUser(){
    if (this.username == this.authService.getCurrentUser()){
      return true;
    }
    else{
      return false;
    }
  }

  onRateChange($event){
    this.authService.postRating(this.project._id, $event, this.authService.getCurrentUser()).subscribe(response => {
      if(response.updated){
        this.flashMessage.show('Thanks for rating', {cssClass: 'alert-success', timeout:3000});
      }
      else{
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout:3000});
      }
    });
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.title = this.route.snapshot.paramMap.get('title');
    this.getProject();

  }


}

