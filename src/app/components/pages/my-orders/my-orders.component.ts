import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Order, OrderResponse } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  user?: User;

  pageSize : number = 99999;

  orderResponse  : OrderResponse = {
    content : [],
    lastPage:true,
    pageNumber:0,
    pageSize : this.pageSize,
    totalElements : this.pageSize,
    totalPages : 1
  } ;

  constructor(
    private _auth: AuthService,
    private _order: OrderService,
    ) {
    this._auth.getLoggedInData().subscribe({
      next: (loginResponse) => {
        this.user = loginResponse.user;
      },
      error: (error: HttpErrorResponse) => {
        if (error.error.message) {
          console.log(error.error.message);
        } else {
          console.log(error);
        }
      },
    });
  }

  ngOnInit(): void {
    if(this.user){
      this._order.getOrdersOfUser(this.user.userId).subscribe(
        {
          next:(ordersOfUser)=>{
            this.orderResponse.content = ordersOfUser;
            this.pageSize = ordersOfUser.length;
          }
        }
      );
    }
  }
}
