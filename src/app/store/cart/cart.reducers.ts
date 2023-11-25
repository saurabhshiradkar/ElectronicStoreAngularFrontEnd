import { createReducer, on } from '@ngrx/store';
import { Cart } from 'src/app/models/cart.model';
import { removeCart, updateCart } from './cart.actions';
import { User } from 'src/app/models/user.model';

function getBlankCart() {
  return {
    cartId: '',
    createdOn: new Date(),
    items: [],
    user: new User('', '', '', '', ''),
  };
}
const initialCart: Cart = getBlankCart();

export const cartReducer = createReducer(
  initialCart,
  on(updateCart, (state, { cart }) => {
    console.log('updating cart in store');
    return { ...cart };
  }),
  on(removeCart,(state)=>{
    return getBlankCart();
  })
);
