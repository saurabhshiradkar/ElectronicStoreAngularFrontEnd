import { Component, Input, OnInit } from '@angular/core';
import { IInfiniteScrollEvent } from 'ngx-infinite-scroll';
import { Order, OrderResponse } from 'src/app/models/order.model';
import { OrderStatus, PaymentStatus } from 'src/app/models/order.request.model';
import { HelperService } from 'src/app/services/helper.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-hub',
  templateUrl: './order-hub.component.html',
  styleUrls: ['./order-hub.component.css']
})
export class OrderHubComponent implements OnInit {

  orderStatus = OrderStatus;
  paymentStatus = PaymentStatus;

 @Input() orderResponse ?: OrderResponse;

  pageNumber = 0;
  loading = false;

  constructor(
    private _order : OrderService,
    private _helper : HelperService,
  
  ){}

  ngOnInit(): void {
    // this.loadPaginatedOrders(0);
  }




  usersScrolled(event: IInfiniteScrollEvent) {
    console.log(event);
    if (this.loading || this.orderResponse?.lastPage) {
      return;
    }

    //load the data of other pages
    this.pageNumber += 1;
    this.loadPaginatedOrders(this.pageNumber);
  }


  private loadPaginatedOrders(
    pageNumber=0,
    pageSize=10,
    sortBy = 'orderedDate',
    sortDir = 'desc'
  ) {

    this.loading = true;
    this._order.getAllOrders(pageNumber, pageSize, sortBy, sortDir).subscribe(
      {
        next: (orderResponse) => {

          if(orderResponse.pageNumber > 0 ){
            this.orderResponse = {
              ...orderResponse,
              content  : [
                ...this.orderResponse!.content,
                ...orderResponse.content
              ],
            }

          }else{
            console.log(orderResponse);
            
            this.orderResponse = orderResponse;
          }

          this.loading = false;
          console.log(orderResponse);
        },
        error:(error)=>{
          this.loading = false;
          console.log(error);
        }
      }
    );
  }

    //open view order modal

    openModal(order : Order){
      this._helper.emitOrderEvent(order);
    }
  
}
