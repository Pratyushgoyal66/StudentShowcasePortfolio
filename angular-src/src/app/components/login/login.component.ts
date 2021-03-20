import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(    
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }
    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('You are now Logged IN.', {cssClass: 'alert-success', timeout:3000});
        this.router.navigate([user.username]);


      }else{
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['/login']);
      }
    });
  }

}
