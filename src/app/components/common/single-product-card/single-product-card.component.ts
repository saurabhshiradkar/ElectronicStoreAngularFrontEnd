import { Component,Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { updateCart } from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-single-product-card',
  templateUrl: './single-product-card.component.html',
  styleUrls: ['./single-product-card.component.css']
})
export class SingleProductCardComponent {
 @Input() product ?: Product;
 user?: User;
 cart?: Cart;
 cartItem ?:CartItem;

  constructor(
    public productService:ProductService,
    private cartService: CartService,
    private cartStore : Store<{cart : Cart}>,
    private toastrService: ToastrService,
    private authService : AuthService,
  ){
    this.authService.getLoggedInData().subscribe({
      next: (loginResponse) => {
        this.user = loginResponse.user;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }


  addToCartRequest(product: Product) {


    this.cartItem = this.cart?.items.find((item) => {
      return item.product.productId === product.productId;
    });
    

    if(this.cartItem){
      
      const quantityAvailableInStock = this.cartItem.product.quantity;

      if (this.cartItem.quantity > quantityAvailableInStock) {
        this.toastrService.error('Not Enough Stock For This Product !');
        return;
      }

    }


      if (!product.stock) {
        this.toastrService.error('Product is out of stock !');
      }
  
      //request to add item in cart
      if (this.user) {
        this.cartService
          .addItemToCart(this.user.userId, {
            productId: product.productId,
            quantity: 1,
          })
          .subscribe({
            next: (updatedCart: Cart) => {
              console.log(updatedCart);
              this.toastrService.success('Item is added to cart !');
              this.cart = updatedCart;
              this.cartStore.dispatch(updateCart({ cart: updatedCart}))
            },
            error: (error) => {
              console.log(error);
              this.toastrService.error('Failed to add item to cart !');
            },
          });
  
      }else{
        this.toastrService.warning('Login first to buy products !')
      }
    
  }



  private addItemToCart(product: Product): void {
    if (this.user) {
      this.cartService
        .addItemToCart(this.user.userId, {
          productId: product.productId,
          quantity: 1,
        })
        .subscribe({
          next: (updatedCart: Cart) => {
            console.log(updatedCart);
            this.toastrService.success('Item is added to cart !');
            this.cart = updatedCart;
            this.cartStore.dispatch(updateCart({ cart: updatedCart}))
          },
          error: (error) => {
            console.log(error);
            this.toastrService.error('Failed to add item to cart !');
          },
        });
    } else {
      this.toastrService.warning('Login first to buy products !');
    }
  }
}
