import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardLoggedOut } from './guards/authLoggedOut.guard';
import { ValidateService } from './services/validate.service';
import {AuthGuardLoggedIn } from './guards/authLoggedIn.guard';
import { AuthService } from './services/auth.service';
import { ProjectComponent } from './components/project/project.component';
import { ProjectGalleryComponent } from './components/project-gallery/project-gallery.component'; 
import { AddProjectComponent } from './components/add-project/add-project.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';

const appRoutes: Routes = [
  {path : '', component: HomeComponent},
  {path : 'register', component: RegisterComponent, canActivate: [AuthGuardLoggedIn]},
  {path : 'login', component: LoginComponent, canActivate: [AuthGuardLoggedIn]},
  {path : ':username', component: ProfileComponent, canActivate: [AuthGuardLoggedOut], runGuardsAndResolvers: 'always'},
  {path : ':username/project/:title', component: ProjectComponent},
  {path : ':username/addProject', component: AddProjectComponent, canActivate: [AuthGuardLoggedOut]},
  {path : ':username/projectGallery', component: ProjectGalleryComponent},
  {path : ':advanced/search', component: AdvancedSearchComponent},

];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    ProjectComponent,
    ProjectGalleryComponent,
    AddProjectComponent,
    AddProjectComponent,
    AdvancedSearchComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    NgbModule
  ],
  providers: [ValidateService, AuthService, AuthGuardLoggedOut, AuthGuardLoggedIn],
  bootstrap: [AppComponent]
})
export class AppModule { }
