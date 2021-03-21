import { Injectable } from '@angular/core';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Observable} from 'rxjs';
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
    console.log(project);
    this.projurl = 'http://localhost:5000/users';
    let headers = new HttpHeaders({'Authorization':this.authToken, 'Content-Type': 'application/json'});
    return this.http.post<any>(
      `${this.projurl}/${project.author}/addProject`,
      project,
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
    localStorage.clear();
  }

<<<<<<< HEAD

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
>>>>>>> a9e9ded0bad283e5ddd357f501d38f102b0fe706
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
