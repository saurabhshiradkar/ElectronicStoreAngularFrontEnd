import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from './models/loginresponse.model';
import { AuthService } from './services/auth.service';
import { Cart } from './models/cart.model';
import { CartService } from './services/cart.service';
import { User } from './models/user.model';
import { updateCart } from './store/cart/cart.actions';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { setLoginData } from './store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-ecom';
  user?: User;

  constructor(
    private toastr: ToastrService,
    private authStore: Store<{ auth: LoginResponse }>,
    private authService: AuthService,
    private cartService: CartService,
    private socialAuth: SocialAuthService,
    private router : Router,
    private cartStore: Store<{ cart: Cart }>,
  ) {
    this.authStore.select('auth').subscribe({
      next: (loginData) => {
        authService.saveLoginDataToLocalStorage(loginData);
        this.user = loginData.user;
      },
    });

    if (this.user) {
      this.cartService.getCartOfUser(this.user.userId).subscribe({
        next: (cart) => {
          this.cartStore.dispatch(updateCart({ cart: cart }));
        },
      });
    }

    this.socialAuth.authState.subscribe({
      next:(user)=>{
        console.log(user);
        this.authService.signInWIthGoogle(user).subscribe({
          next:(data : LoginResponse)=>{
            console.log(data);
            this.authStore.dispatch(setLoginData(data));
            this.router.navigate(['/store']);     
          },
          error:(error)=>{
            this.toastr.error('Error in Login From Backend !');
            console.log(error);
          }
        });
      },
      error : (error)=>{
        console.log(error);
        
      }
    })
  }

  showToast() {
    this.toastr.success('Electronic Store', 'This is success message', {
      closeButton: true,
    });
  }
}
