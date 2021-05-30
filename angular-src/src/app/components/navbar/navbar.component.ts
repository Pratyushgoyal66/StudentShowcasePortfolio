import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Observable, of, OperatorFunction} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searching = false;
  searchFailed = false;

  formatter = (result) => result.username;

  search: OperatorFunction<string, readonly {username}[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    tap(() => this.searching = true),
    switchMap(term =>
      this.authService.search(term).pipe(
        tap(() => this.searchFailed = false),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        } )
      )
      ),
      tap(() => this.searching = false)
    
  )

  constructor(    
    private flashMessage: FlashMessagesService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { 

    }

  ngOnInit(): void { 

   }
  onLogoutClick(){

    this.authService.logout();
    this.flashMessage.show('You have successfully Logged Out.', {cssClass: 'alert-success', timeout:3000});
    this.router.navigate(['/login']);
    return false;
  }
  onSelect($event, input) {
    $event.preventDefault();
    input.value = '';
  }
  




}
