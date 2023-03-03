import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { el, setChildren, setStyle } from 'redom';
import { convertNumberToRupiah } from '../Utils';
import { db } from '../firebase';
import NavApp from '../components/NavApp';
import StoreList from '../components/StoreList';
import FooterApp from '../components/FooterApp';
import AuthNetwork from '../network/AuthNetwork';
import CartModal from '../components/CartModal';
import CartList from '../components/CartList';
import { Modal } from 'bootstrap';

export default class Dashboard {
  el;

  navAppEl;

  storeListEl;

  modalContainer;

  cartModalEl;
  cartModalBs;

  cartItemsList = [];
  restaurantItemsList = [];

  totalCartUnsub;
  listCartItemsUnsub;
  listRestaurantUnsub;

  constructor(_) {
    this.navAppEl = new NavApp({ brandName: 'Food Court App' });

    this.el = el('div', [
      el('header', [this.navAppEl]),
      el(
        'main',
        el(
          'div.main-content',
          el('div.container.py-5', [
            el('h1.mb-3', 'Restaurant'),
            (this.storeListEl = el('div#storeList')),
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

      /*Init store list*/
      this.listenForRestaurants();

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

    /*Get reference for cart items*/
    const cartItemsRef = collection(ownCartRef, 'items');

    /*Get realtime data of cart items*/
    this.listCartItemsUnsub = onSnapshot(cartItemsRef, (itemsSnapshot) => {
      /*Set cart items to empty*/
      this.cartItemsList.splice(0, this.cartItemsList.length);

      itemsSnapshot.forEach((item) => {
        this.cartItemsList.push({ docId: item.id, ...item.data() });
      });
      this.populateCartItems(this.cartItemsList);
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

  listenForRestaurants() {
    this.listRestaurantUnsub = onSnapshot(
      collection(db, `restaurants`),
      (itemsSnapshot) => {
        if (itemsSnapshot.size === 0) {
          console.warn('Tidak ada data restoran');
        }

        this.restaurantItemsList.slice(0, this.restaurantItemsList.length);
        itemsSnapshot.forEach((item) => {
          this.restaurantItemsList.push({ docId: item.id, ...item.data() });
        });

        this.populateStoreItems(this.restaurantItemsList);
      },
    );
  }

  populateStoreItems(restaurants) {
    if (restaurants.length > 0) {
      setChildren(this.storeListEl, [new StoreList({ restaurants })]);
    } else {
      setChildren(this.storeListEl, [this.templateEmptyStore()]);
    }
  }

  showCartModal(target) {
    this.cartModalBs.show(target);
  }

  templateEmptyStore() {
    return el('p.text-center', 'Tidak ada toko/warung makan yang tersedia!');
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
    if (this.listRestaurantUnsub) {
      this.listRestaurantUnsub();
    }
  }
}
