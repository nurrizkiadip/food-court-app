import { el } from 'redom';
import { convertNumberToRupiah, limitText } from '../Utils';
import RestaurantNetwork from '../network/RestaurantNetwork';
import AddToCardButton from './AddToCardButton';

export default class MenuItem {
  el;

  addToCardButton;

  cardImage;

  docId;

  constructor(storeId, docId, { name, image, description, price }) {
    this.docId = docId;

    this.cardImage = el('img.card-img-top', {
      src: image || 'https://placeimg.com/720/400/food',
    });

    this.addToCardButton = new AddToCardButton(
      `Add (${convertNumberToRupiah(price)}) to card`,
      async (event) => {
        event.preventDefault();

        try {
          await RestaurantNetwork.addMealToCard({
            docId,
            name,
            price,
          });

          this.addToCardButton.setEnabled(false);
        } catch (error) {
          console.error(error);
        }
      },
    );

    this.el = el('div.card.h-100', [
      this.cardImage,

      el('div.card-body', [
        el('h5.card-title', name),
        el('p', limitText(description)),
        el('div.d-flex.justify-content-end', this.addToCardButton),
      ]),
    ]);
  }
}
