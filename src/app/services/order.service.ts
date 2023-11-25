import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderRequest } from '../models/order.request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private _http:HttpClient,

  ) { }

  createOrder(orderRequest:OrderRequest){

    return this._http.post(`${environment.apiUrl}/orders`,orderRequest);

  }




}
