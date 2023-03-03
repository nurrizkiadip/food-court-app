import { el, setChildren, setStyle } from 'redom';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { convertNumberToRupiah } from '../Utils';
import { db } from '../firebase';
import NavApp from '../components/NavApp';
import FooterApp from '../components/FooterApp';
import MenuList from '../components/MenuList';
import AuthNetwork from '../network/AuthNetwork';
import CartModal from '../components/CartModal';
import CartList from '../components/CartList';
import { Modal } from 'bootstrap';

export default class StoreDetail {
  el;

  storeId;

  mealListEl;

  modalContainer;

  cartItemsList = [];
  mealItemsList = [];

  cartModalEl;
  cartModalBs;

  totalCartUnsub;
  listCartItemsUnsub;
  listStoreMealsUnsub;

  constructor(_, { storeId }) {
    this.storeId = storeId;
    this.navAppEl = new NavApp({ brandName: 'Food Court App' });

    this.el = el('div', [
      el('header', this.navAppEl),
      el(
        'main',
        el(
          'div.main-content',
          el('div.container.py-5', [
            el('h1.mb-3', 'Store Detail'),
            (this.mealListEl = el('div#mealList')),
          ]),
        ),
      ),
      el('footer', new FooterApp()),
      (this.modalContainer = el('div')),
    ]);

    /*Click for open modal*/
    this.navAppEl.navListEl.cartButton.addEventListener('click', (event) => {
      this.showCartModal(event.relatedTarget);
    });

    this.listenForAuth();
  }

  listenForAuth() {
    AuthNetwork.listenForAuth(async (user) => {
      const isUserSignedIn = Boolean(user);

      if (isUserSignedIn) {
        await this.listenForCart(user.uid);

        this.navAppEl.navListEl.wannaShowLoginButton(false);
        this.navAppEl.navListEl.wannaShowUserDropdown(true);
        this.navAppEl.navListEl.wannaShowCartButton(true);
      } else {
        this.navAppEl.navListEl.wannaShowLoginButton(true);
        this.navAppEl.navListEl.wannaShowUserDropdown(false);
        this.navAppEl.navListEl.wannaShowCartButton(false);
      }

      /*Init meal list*/
      this.listenForMeals();

      setStyle(this.navAppEl.navListEl.loginButton, {
        display: !isUserSignedIn ? 'inline' : 'none',
      });
      setStyle(this.navAppEl.navListEl.logoutButton, {
        display: isUserSignedIn ? 'inline' : 'none',
      });
    });
  }

  async listenForCart(uid) {
    if (!uid) {
      throw new Error('Parameter uid bernilai null');
    }

    const cartRef = collection(db, 'carts');
    const ownCartRef = doc(cartRef, uid);

    try {
      await setDoc(ownCartRef, { ownerUID: uid }, { merge: true });
    } catch (error) {
      console.error(error);
    }

    /*Update total of cart items, price and count*/
    this.totalCartUnsub = onSnapshot(ownCartRef, (itemsSnapshot) => {
      const data = itemsSnapshot.data();

      const price = data.totalPrice || 0;
      const count = data.itemCount || 0;

      this.navAppEl.navListEl.setTotalCart(
        `${convertNumberToRupiah(price)} (${count})`,
      );
    });

    /*Get realtime data of cart items*/
    const cartItemsRef = collection(ownCartRef, 'items');
    this.listCartItemsUnsub = onSnapshot(cartItemsRef, (itemsSnapshot) => {
      /*Set cart items to empty*/
      this.cartItemsList.splice(0, this.cartItemsList.length);

      itemsSnapshot.forEach((item) => {
        this.cartItemsList.push({ docId: item.id, ...item.data() });
      });

      this.populateCartItems(this.cartItemsList);
      this.populateMealItems(this.mealItemsList);
    });
  }

  populateCartItems(carts) {
    if (carts.length > 0) {
      this.cartModalEl = new CartModal(new CartList({ carts }));
    } else {
      this.cartModalEl = new CartModal(this.templateEmptyCart());
    }

    setChildren(this.modalContainer, [this.cartModalEl]);
    this.cartModalBs = new Modal(this.cartModalEl.el);
  }

  listenForMeals() {
    this.listStoreMealsUnsub = onSnapshot(
      collection(db, `restaurants/${this.storeId}/meals`),
      (itemsSnapshot) => {
        if (itemsSnapshot.size === 0) {
          console.warn('Tidak ada makanan/minuman di restoran ini');
        }

        /*Set cart items to empty*/
        this.mealItemsList.splice(0, this.mealItemsList.length);

        itemsSnapshot.forEach((item) => {
          this.mealItemsList.push({
            docId: item.id,
            ...item.data(),
          });
        });

        this.populateMealItems(this.mealItemsList);
      },
    );
  }

  populateMealItems(meals) {
    if (meals.length > 0) {
      const menuList = new MenuList(this.storeId, { meals });

      const cartItemDocId = [];
      this.cartItemsList.forEach((item) => {
        cartItemDocId.push(item.docId);
      });

      menuList.getAllMeals().forEach((meal) => {
        const isInCart = cartItemDocId.indexOf(meal.docId) >= 0;
        meal.addToCardButton.setEnabled(!isInCart);
      });

      setChildren(this.mealListEl, [menuList]);
    } else {
      setChildren(this.mealListEl, [this.templateEmptyMeals()]);
    }
  }

  showCartModal(target) {
    this.cartModalBs.show(target);
  }

  templateEmptyMeals() {
    return el('p.text-center', 'Tidak ada makanan/minuman yang tersedia!');
  }

  templateEmptyCart() {
    return el('p.text-center', 'Keranjangmu sedang kosong!');
  }

  onmount() {
    console.log(`mounted ${this.constructor.name}`);
  }

  onremount() {
    console.log(`remounted ${this.constructor.name}`);
  }

  onunmount() {
    console.log(`unmounted ${this.constructor.name}`);

    if (this.totalCartUnsub) {
      this.totalCartUnsub();
    }
    if (this.listCartItemsUnsub) {
      this.listCartItemsUnsub();
    }
    if (this.listStoreMealsUnsub) {
      this.listStoreMealsUnsub();
    }
  }
}
