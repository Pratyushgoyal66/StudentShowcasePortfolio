import { Injectable } from '@angular/core';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

import { ObserveOnOperator } from 'rxjs/internal/operators/observeOn';

@Injectable({
  providedIn: 'root'
})



export class AuthService {

  authToken: any;
  user: any;
  project: any;
  projurl: any;
  username: String;


  constructor(
    private http: HttpClient
    ) {   }

  registerUser(user){
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(
      "http://localhost:5000/users/register",
      user,
      {headers: headers}
    ).pipe(map(res => res));

  }

  addProject(project){
    this.loadToken();
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Authorization':this.authToken, 'Content-Type': 'application/json'});
    return this.http.post<any>(
      `${this.projurl}/${project.author}/addProject`,
      project,
      {headers: headers}
    ).pipe(map(res => res));
  }

  deleteProject(username: String, title: String){
    this.loadToken();
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Authorization': this.authToken});
    return this.http.delete(
      `${this.projurl}/${username}/project/${title}/delete`,
      {headers: headers}
    ).pipe(map(res => res));
  }

  editProject(projId, updateFields, username, title){
    this.loadToken();
    var projBody = {
      'projId': projId,
      'updateFields': updateFields
    }
    let headers = new HttpHeaders({'Authorization':this.authToken, 'Content-Type': 'application/json'});
    return this.http.post<any>(
      `${this.projurl}/${username}/project/${title}/editProject`,
      projBody,
      {headers: headers}
    ).pipe(map(res => res));
  }

  authenticateUser(user){
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(
      "http://localhost:5000/users/authenticate",
      user,
      {headers: headers}
    ).pipe(map(res => res));
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('user');
    localStorage.clear();
    localStorage.clear();
  }


  getAnyProfile(username: String){
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any>(
      `${this.projurl}/view/${username}`,
      {headers: headers}
    ).pipe(map(res => res));
  }

  getProfile(){
    this.username = this.getCurrentUser();
    this.projurl = 'http://localhost:5000/users';
    this.loadToken();
    let headers = new HttpHeaders({'Authorization':this.authToken, 'Content-Type': 'application/json'});
    return this.http.get<any>(
      `${this.projurl}/${this.username}`,
      {headers: headers}
    ).pipe(map(res => res));

  }

  getProject(username: String, title: String){
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any>(
      `${this.projurl}/${username}/project/${title}`,
      {headers: headers}
    ).pipe(map(res => res));
  }

  
  getProjectGallery(username: String){
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any>(
      `${this.projurl}/${username}/projectGallery`,
      {headers: headers}
    ).pipe(map(res => res));
  }

  getCurrentUser(){
    return JSON.parse(localStorage.getItem('user')).username;    
  }

  getCurrentUserId(){
    return JSON.parse(localStorage.getItem('user')).id;    
  }

  search(word){
    if (word === '') {
      return of([]);
    }
    var searchReq = {"username": word};
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any>(
      `${this.projurl}/search/${word}`,
      {headers: headers}
    ).pipe(map(res => res));
  }

  advancedSearch(){
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any>(
      `${this.projurl}/advanced/search/`,
      {headers: headers}
    ).pipe(map(res => res));
  }

  postComment(projId, userId, comment){
    const commentData = {
      projId: projId,
      userId: userId,
      comment: comment
    };
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Authorization':this.authToken, 'Content-Type': 'application/json'});
    return this.http.post<any>(
      `${this.projurl}/comment`,
      commentData,
      {headers: headers}
    ).pipe(map(res => res));

  }

  deleteComment(comment){
    this.loadToken();
    this.projurl = 'http://localhost:5000/users';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization':this.authToken, 'Content-Type': 'application/json'}), body: comment
  };

    return this.http.delete(
      `${this.projurl}/comment`,
      httpOptions
    ).pipe(map(res => res));
  }

  postRating(projId, ratingGiven, reviewer){
    var review = {
      'review': {
        'projId': projId,
        'ratingGiven': ratingGiven,
        'reviewer': reviewer
      }
    };
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Authorization':this.authToken, 'Content-Type': 'application/json'});
    return this.http.post<any>(
      `${this.projurl}/rating`,
      review,
      {headers: headers}
    ).pipe(map(res => res));
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    this.loadToken();
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.authToken); //False if Token is good, True if not good
}

}
