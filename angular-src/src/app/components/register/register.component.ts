import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import {Observable} from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    phoneNo: new FormControl(''),
    role: new FormGroup({
      type: new FormControl('')
    }),
    social: new FormGroup({
      github: new FormControl(''),
      linkedin: new FormControl('')
    }),
    enrollmentNo: new FormControl(''),
    department: new FormControl('')
  });

  public ROLE_TYPE = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    UNIVERSITY: 'university'
  };


  constructor(
    private validateService: ValidateService, 
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  setRoleType(type: string) {
    // update payment method type value
    const ctrl = this.regForm.get('role.type');
    ctrl.setValue(type);
  }

  onRegisterSubmit(){
    const rawUser = this.regForm.getRawValue();
    let user = {
      name: String,
      username: String,
      email: String,
      password: String,
      phoneNo: Number,
      role: {
        type: String
      },
      social: {
        github: String,
        linkedin: String
      },
      enrollmentNo: Number,
      department: String
    }
    user.name = rawUser.name;
    user.username = rawUser.username;
    user.email =  rawUser.email;
    user.password = rawUser.password;
    if(rawUser.phoneNo !== ''){
      user.phoneNo = rawUser.phoneNo;
    }
    user.social = rawUser.social;
    user.role = rawUser.role;
    
    if(rawUser.enrollmentNo !== ''){
      user.enrollmentNo = rawUser.enrollmentNo;
    }
 
    user.department = rawUser.department;
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Please fill in all fields.', {cssClass: 'alert-danger', timeout:3000});
      return false;
    }
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show('Please fill in a valid email', {cssClass: 'alert-danger', timeout:3000});
      return false;
    }

    //Register User
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        
        this.flashMessage.show('Thanks for registering, You can now login!!', {cssClass: 'alert-success', timeout:3000});
        this.router.navigate(['/login']);
      } else{
        this.flashMessage.show('Something went wrong, Registration Failed!', {cssClass: 'alert-danger', timeout:3000});
        this.router.navigate(['/register']);
      }
    });

  }

}
