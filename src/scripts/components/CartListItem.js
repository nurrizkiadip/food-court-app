import { el } from 'redom';
import { convertNumberToRupiah } from '../Utils';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default class CartListItem {
  el;

  deleteButton;

  constructor(cart) {
    this.deleteButton = el(
      'button.btn.btn-sm.btn-danger.text-white.rounded-circle.ms-2',
      { 'data-bs-dismiss': 'modal' },
      [el('i.bi.bi-trash3-fill')],
    );

    this.el = el('li.list-group-item', [
      `${cart.name} - ${convertNumberToRupiah(cart.price)}`,
      this.deleteButton,
    ]);

    this.deleteButton.addEventListener('click', async () => {
      const itemRef = doc(
        db,
        `carts/${auth.currentUser.uid}/items/${cart.docId}`,
      );

      try {
        await deleteDoc(itemRef);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
