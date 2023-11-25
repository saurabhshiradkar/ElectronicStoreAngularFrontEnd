import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from './models/loginresponse.model';
import { AuthService } from './services/auth.service';
import { Cart } from './models/cart.model';
import { CartService } from './services/cart.service';
import { User } from './models/user.model';
import { updateCart } from './store/cart/cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'angular-ecom';
  user ?: User;


  constructor(
    private toastr:ToastrService, 
    private store : Store<{auth : LoginResponse}>,
    private authService : AuthService,
    private cartService : CartService,
    private cartStore : Store<{cart : Cart}>,
    ){
    this.store.select('auth').subscribe({
      next : loginData => {
        authService.saveLoginDataToLocalStorage(loginData);
        this.user = loginData.user;
      }
    });

    if(this.user){
      this.cartService.getCartOfUser(this.user.userId).subscribe(
        {
          next:(cart)=>{
            this.cartStore.dispatch(updateCart({cart : cart}));
          }
        }
      )
    }
  }

  showToast() {
    this.toastr.success('Electronic Store', 'This is success message',{
      closeButton: true
    });
  }
}
