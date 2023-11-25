import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IInfiniteScrollEvent } from 'ngx-infinite-scroll';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/models/cart.model';
import { Product, ProductsResponse } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { updateCart } from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {

  productsResponse?: ProductsResponse;

  pageNumber = 0;
  loading = false;
  cart?: Cart;
  user?: User;

  constructor(
    public productService: ProductService,
    private cartStore : Store<{cart : Cart}>,
    private authService: AuthService,
    public cartService: CartService,
    private toastrService: ToastrService,
    ) {}

  ngOnInit(): void {
    this.loadProducts(0);
    this.loadCart();
  }




  loadProducts(
    pageNumber = 0,
    pageSize = 10,
    sortBy = 'addedDate',
    sortDir = 'desc'
  ) {
    this.loading = true;
    this.productService.getLiveProducts(pageNumber,pageSize,sortBy,sortDir).subscribe({
      next: (productsResponse) => {
        if (this.pageNumber==0) {
          this.productsResponse = productsResponse;
          console.log(this.productsResponse);
        }else{
          this.productsResponse = {
            ...productsResponse,
            content:[...(this.productsResponse?.content as Product[]),...productsResponse.content,],
          }
        }
        console.log(this.productsResponse);
        this.loading = false;
      },
      error:(error)=>{
        console.log(error);
        this.loading = false;
      }
    });
  }


  productsScrolled(event: IInfiniteScrollEvent) {
    console.log(event);
    if (this.loading || this.productsResponse?.lastPage) {
      return;
    }else{
      console.log('Loading Data from server !');
      
      this.pageNumber +=1
      this.loadProducts(this.pageNumber)
    }
  }

  loadCart() {

    this.authService.getLoggedInData().subscribe({
      next:(loginResponse)=>{
        this.user = loginResponse.user;
      }
    })

    if (this.user) {
      this.cartService.getCartOfUser(this.user?.userId as string).subscribe({
        next: (cart) => {
          this.cart = cart;
          console.log(this.cart);
          console.log("CART LOADED " );
          this.cartStore.dispatch(updateCart({cart : this.cart}))
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('Error in Loading Cart')
        },
      });
    }
  }
}
