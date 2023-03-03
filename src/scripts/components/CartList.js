import { el } from 'redom';
import CartListItem from './CartListItem';

export default class CartList {
  el;

  constructor({ carts }) {
    const cartElements = [];
    carts.forEach((cart) => {
      cartElements.push(new CartListItem(cart));
    });

    this.el = el('ol.list-group.list-group-numbered', cartElements);
  }
}
