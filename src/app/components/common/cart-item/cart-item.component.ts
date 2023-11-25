import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {


  @Input() cartItem?:CartItem;

  @Output() itemIncreaseQuantityEvent = new EventEmitter<CartItem>();

  @Output() itemDecreseQuantityEvent = new EventEmitter<CartItem>();

  @Output() itemDeleteItemEvent = new EventEmitter<CartItem>();

  constructor(public productService: ProductService){}




  increaseQuantity(cartItem: CartItem) {
    this.itemIncreaseQuantityEvent.next(cartItem);
  }
  decreaseQuanity(cartItem: CartItem) {
    this.itemDecreseQuantityEvent.next(cartItem);
  }
  deleteQuantity(cartItem: CartItem){
    this.itemDeleteItemEvent.next(cartItem)
  }
}
