import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { OrderStatus, PaymentStatus } from 'src/app/models/order.request.model';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-view-modal',
  templateUrl: './order-view-modal.component.html',
  styleUrls: ['./order-view-modal.component.css']
})
export class OrderViewModalComponent implements OnInit,OnDestroy {


  orderStatus  = OrderStatus;
  paymentStatus = PaymentStatus;
  updateState = false;

  closeResult : any

  public modalSubscription ?:Subscription

  order ?:Order;
  @ViewChild("content") content ?: ElementRef

  constructor(
    private modalService : NgbModal,
    private _helper : HelperService,
    public productService : ProductService,
    public _auth:AuthService,
    private _payment :PaymentService,
    private toastrService : ToastrService,
    private router : Router,

  ){}


  ngOnInit(): void {
    console.log("Subscribing");
    
    this.modalSubscription = this._helper.openOrderModalEmitter.subscribe(
      {
        next: (order : Order)=>{
          console.log(order);
          this.order = order;
          this.open(this.content)
        }
      }
    );

  }


  ngOnDestroy(): void {
    console.log('Unsubscribing');
    
    this.modalSubscription?.unsubscribe();
  }

  payForOrder(order: Order|undefined) {

    if(order){
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
                  this.router.navigate(['/my/orders']);
                  this.modalService.dismissAll();
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
    }

  }


	open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'xl' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}


  changeState(){
    this.updateState = !this.updateState;
  }

  compareFn(value: any, option: any) {
    return value === option;
  }

}
