export interface OrderRequest {
  userId:string;
  cartId:string;
  billingName: string;
  billingPhone: string;
  billingAddress: string;
  orderStatus: OrderStatus;
  paymentStatus : PaymentStatus;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
}
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
}
