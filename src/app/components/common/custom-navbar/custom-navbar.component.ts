import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoginResponse } from 'src/app/models/loginresponse.model';
import { AuthService } from 'src/app/services/auth.service';
import { removeLoginData } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-custom-navbar',
  templateUrl: './custom-navbar.component.html',
  styleUrls: ['./custom-navbar.component.css']
})
export class CustomNavbarComponent {
  collapse=true;

  loginData ? : LoginResponse; 

  isAdmin ?: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store : Store<{auth : LoginResponse}>,
    private router : Router
    ){
    // console.log(this.loginData);
    authService.getLoggedInData().subscribe({
      next:(loginData) => {
        this.loginData = loginData;
        // console.log(this.loginData);
        
      }
    });

    this.isAdmin =  this.authService.checkLoginAndAdminUser();
  }

  toggle(){
    this.collapse = !this.collapse;
  }

  logout(){
    this.store.dispatch(removeLoginData());
    this.router.navigate(['/login'])
  }

}
