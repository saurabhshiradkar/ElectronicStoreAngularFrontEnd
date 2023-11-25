import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent {
  productId?: string;
  product?: Product;
  user?: User;
  cart?: Cart;
  cartItem ?:CartItem;

  constructor(
    private acivatedRoute: ActivatedRoute,
    public productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private toastrService: ToastrService,
    private cartStore : Store<{cart : Cart}>,
    private title: Title
  ) {
    this.acivatedRoute.params.subscribe((params) => {
      this.productId = params['productId'];
      console.log(this.productId);
      this.loadProduct();
    });

    this.authService.getLoggedInData().subscribe({
      next: (loginResponse) => {
        this.user = loginResponse.user;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadProduct() {
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe({
        next: (product) => {
          console.log(product);
          this.product = product;
          this.title.setTitle(product.title);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
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
            this.cartStore.dispatch(updateCart({ cart: updatedCart}))
          },
          error: (error : HttpErrorResponse) => {
            console.log(error);
            if(error.error.message.includes('Not Enough Stock Exists For Product !')){

              this.toastrService.error('Not Enough Stock Exists For Product !');
            }else{
              this.toastrService.error('Failed to add item to cart !');
            }
          },
        });
    }
    else{
      this.toastrService.warning('Login first to buy products !')
    }
  }
}
