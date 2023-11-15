import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from './models/loginresponse.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-ecom';
  constructor(
    private toastr:ToastrService, 
    private store : Store<{auth : LoginResponse}>,
    private authService : AuthService
    ){
    this.store.select('auth').subscribe({
      next : loginData => {
        authService.saveLoginDataToLocalStorage(loginData);
      }
    })
  }

  showToast() {
    this.toastr.success('Electronic Store', 'This is success message',{
      closeButton: true
    });
  }
}
