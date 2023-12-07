import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';
import {
  OrderRequest,
  OrderStatus,
  PaymentStatus,
} from 'src/app/models/order.request.model';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { updateCart } from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnDestroy {
  cart?: Cart;
  user?: User;

  orderRequest: OrderRequest = {
    userId: '',
    cartId: '',
    billingName: '',
    billingPhone: '',
    billingAddress: '',
    orderStatus: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
  };

  private userSubscription?:Subscription;

  constructor(
    private authService: AuthService,
    public cartService: CartService,
    private cartStore: Store<{ cart: Cart }>,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private _order: OrderService,
    private _payment : PaymentService,

    private router: Router
  ) {
    this.userSubscription = this.authService.getLoggedInData().subscribe({
      next: (loginResponse) => {
        if (!loginResponse.user) {
          this.toastrService.warning('Please Login !');
          console.log('USER NOT LOOGGED IN ');

          this.router.navigate(['/login']);
        }
        this.user = loginResponse.user;

        this.loadCart();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  loadCart() {
    if (this.user) {
      this.cartService.getCartOfUser(this.user?.userId as string).subscribe({
        next: (cart) => {
          this.cart = cart;
          console.log(this.cart);
          this.cartStore.dispatch(updateCart({ cart: this.cart }));

          this.orderRequest.cartId = cart.cartId;
          this.orderRequest.userId = this.user?.userId as string;

          console.log(this.orderRequest);
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('Error in Loading Cart');
        },
      });
    }
  }

  increaseQuantity(cartItem: CartItem) {
    const quantityAvailableInStock = cartItem.product.quantity;

    if (cartItem.quantity > quantityAvailableInStock) {
      this.toastrService.error('Not Enough Stock For This Product !');
      return;
    } else {
      this.updateQuantityOfProductInCart(cartItem, 1);
    }
  }

  decreseQuantity(cartItem: CartItem) {
    const quantityToUpdate = cartItem.quantity - 1;
    if (quantityToUpdate <= 0) {
      this.toastrService.error('Quantity can not be Zero!');
      // this.deleteItemFromCart(cartItem);
      return;
    } else {
      this.updateQuantityOfProductInCart(cartItem, -1);
    }
  }

  deleteItem(cartItem: CartItem) {
    this.deleteItemFromCart(cartItem);
  }

  clearCart() {
    this.cartService.clearCart(this.user?.userId as string).subscribe({
      next: (clearCartResponse: any) => {
        if (clearCartResponse.success) {
          this.toastrService.success('Cart Cleared !');

          if (this.cart) {
            this.cart = {
              ...this.cart,
              items: [],
            };
            this.cartStore.dispatch(updateCart({ cart: this.cart }));
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private deleteItemFromCart(cartItem: CartItem) {
    this.cartService
      .removeItemFromCart(this.user?.userId as string, cartItem.cartItemId)
      .subscribe({
        next: (deleteResponse: any) => {
          if (deleteResponse.success) {
            this.toastrService.success('Item Deleted Succesfully !');

            if (this.cart) {
              this.cart = {
                ...this.cart,
                items: this.cart.items.filter((item) => {
                  console.log('item.cartItemId  ' + item.cartItemId);
                  console.log('cartItem.cartItemId ' + cartItem.cartItemId);

                  return item.cartItemId !== cartItem.cartItemId;
                }),
              };

              this.cartStore.dispatch(updateCart({ cart: this.cart }));
            }
          }
        },
        error: (error) => {
          console.log(error);
          this.toastrService.error('Error while deleting item !');
        },
      });
  }

  private updateQuantityOfProductInCart(
    cartItem: CartItem,
    newQuantity: number
  ) {
    if (!cartItem.product.stock) {
      this.toastrService.error('Product is out of stock !');
    }

    //request to add item in cart
    if (this.user) {
      this.cartService
        .addItemToCart(this.user.userId, {
          productId: cartItem.product.productId,
          quantity: newQuantity,
        })
        .subscribe({
          next: (updatedCart: Cart) => {
            console.log(updatedCart);
            this.toastrService.success('Quantity Updated !');
            this.cart = updatedCart;
            this.cartStore.dispatch(updateCart({ cart: updatedCart }));
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            if (
              error.error.message.includes(
                'Quantity Can not be Negative or Zero !'
              )
            ) {
              this.toastrService.error('Quantity can not be Zero!');
            } else if (
              error.error.message.includes(
                'Not Enough Stock Exists For Product !'
              )
            ) {
              this.toastrService.error('Not Enough Stock Exists For Product !');
            } else {
              this.toastrService.error('Failed to add item to cart !');
            }
          },
        });
    } else {
      this.toastrService.warning('Login first to buy products !');
    }
  }

  // open order modal

  openPlaceOrderModal(modalContent: any) {
    if (this.cart && this.cart?.items.length > 0) {
      this.modalService.open(modalContent, {
        size: 'lg',
        scrollable: true,
      });
    }
  }

  createOrderFormSubmitted(event: SubmitEvent) {
    event.preventDefault();

    if (this.orderRequest.billingName === '') {
      this.toastrService.warning('Billing Name is Required !');
      return;
    }
    if (this.orderRequest.billingPhone === '') {
      this.toastrService.warning('Billing Phone is Required !');
      return;
    }
    // Check if billingPhone is a valid 10-digit number
    const billingPhoneAsNumber = parseInt(this.orderRequest.billingPhone);
    if (
      isNaN(billingPhoneAsNumber) ||
      billingPhoneAsNumber.toString().length !== 10
    ) {
      this.toastrService.warning(
        'Please enter a valid 10-digit mobile number for Billing Phone!'
      );
      return;
    }
    if (this.orderRequest.billingAddress === '') {
      this.toastrService.warning('Billing Phone is Required !');
      return;
    }

    console.log(this.orderRequest);

    this._order.createOrder(this.orderRequest).subscribe({
      next: (order : any) => {
        this.toastrService.success('Order Created !', '', {
          positionClass: 'toast-bottom-center',
        });
        this.toastrService.info('processing for the payment... !', '', {
          positionClass: 'toast-bottom-center',
        });
        this.modalService.dismissAll()
        this.loadCart();
        //initiate payment
        const subscription = this._payment.initiatePayment(order.orderId).subscribe({
          next:(data : any)=>{
            console.log(data);
            this._payment.payWithRazorPay({
              amount : data.amount,
              razorpayOrderId : data.razorpayOrderId,
              userName : order.billingName,
              email : order.user.email,
              contact : order.billingPhone,
            }).subscribe({
              next:(data)=>{
                //success
                console.log("From Cart Component");
                console.log(data);
                subscription.unsubscribe();

                //
                this._payment.captureAndVarifyPayment(order.orderId,data).subscribe({
                  next:(data : any)=>{
                    console.log(data);
                    this.toastrService.success(data.message);
                  },
                  error:(error)=>{
                    console.log(error);
                    this.toastrService.error("Error In Capturing Payment !")
                  }
                })
              },
              error:(error)=>{
                console.log("Error From Cart Component");
                console.log(error);
                subscription.unsubscribe();
              },
            });
            
          },
        });
      },
    });
  }
}
