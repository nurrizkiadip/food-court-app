import { el, setChildren, setStyle } from 'redom';
import StoreItem from './StoreItem';

export default class StoreList {
  el;

  constructor({ restaurants } = {}) {
    this.el = el('div.store-list.row');

    setStyle(this.el, {
      gap: '1.5rem 0',
    });

    const storeItems = [];
    for (const restaurant of restaurants) {
      storeItems.push(
        el(
          'div.col-12.col-sm-6.col-md-4.col-lg-3',
          new StoreItem({
            name: restaurant.name,
            image: restaurant.imageUrl,
            description: restaurant.description,
            to: `/stores/${restaurant.docId}`,
          }),
        ),
      );
    }

    setChildren(this.el, storeItems);
  }
}
