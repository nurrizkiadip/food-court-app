import { el, setChildren, setStyle } from 'redom';
import MenuItem from './MenuItem';

export default class MenuList {
  el;

  mealList = [];

  constructor(storeId, { meals } = {}) {
    this.el = el('div.menu-list.row');

    setStyle(this.el, {
      gap: '1.5rem 0',
    });

    const listItems = [];
    for (const meal of meals) {
      const menuItemsEl = new MenuItem(storeId, meal.docId, {
        name: meal.name,
        image: meal.imageUrl,
        description: meal.description,
        price: meal.price,
      });
      this.mealList.push(menuItemsEl);

      listItems.push(el('div.col-12.col-sm-6.col-md-4.col-lg-3', menuItemsEl));
    }

    setChildren(this.el, listItems);
  }

  getAllMeals() {
    return this.mealList;
  }
}
