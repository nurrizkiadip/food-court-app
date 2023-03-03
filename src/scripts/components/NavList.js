import { el, setStyle } from 'redom';
import { signInAnonymously, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import NavItem from './NavItem';
import router from '../router';

export default class NavList {
  el;

  homeButton;
  loginButton;
  logoutButton;
  cartButton;

  constructor() {
    this.el = el('ul.navbar-nav.ms-auto.mb-2.mb-lg-0', [
      (this.homeButton = new NavItem({
        text: 'Home',
        to: '/',
        isNavigoActive: '',
      })),
      new NavItem({
        text: 'About',
        to: 'https://github.com/nurrizkiadip',
        target: '_blank',
      }),

      el('li.vr.mx-sm-2'),

      (this.cartButton = el('li.nav-item', [
        el('button.btn.text-decoration-none', [
          el('i.bi.bi-cart4.me-2'),
          (this.cartStatus = el('span#total')),
        ]),
      ])),
      (this.loginButton = el('li.nav-item', [
        el('a.nav-link', { href: '#' }, 'Login'),
      ])),
      (this.userDropdown = el('li.nav-item.dropdown', [
        el(
          'button.btn.dropdown-toggle',
          {
            'data-bs-toggle': 'dropdown',
            'aria-expanded': 'false',
          },
          'User',
        ),
        el('ul.dropdown-menu. dropdown-menu-end', [
          // (this.userProfileButton = el('li', [
          //   el(
          //     'a.dropdown-item',
          //     { 'href': `/user-profile`, 'data-navigo': '' },
          //     'User Profile',
          //   ),
          // ])),
          (this.logoutButton = el('li', [
            el('a.dropdown-item', { href: '#' }, 'Logout'),
          ])),
        ]),
      ])),
    ]);

    this.homeButton.el.addEventListener('click', async (event) => {
      event.preventDefault();
      router.navigate('/');
    });

    this.loginButton.addEventListener('click', async (event) => {
      event.preventDefault();

      try {
        const result = await signInAnonymously(auth);

        console.log('Signed In');
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    });

    this.logoutButton.addEventListener('click', async (event) => {
      event.preventDefault();

      try {
        await signOut(auth);

        console.log('Signed Out');
      } catch (error) {
        console.error(error);
      }
    });

    // this.userProfileButton.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   router.navigate('/user-profile');
    // });
  }

  setTotalCart(text) {
    this.cartStatus.textContent = text;
  }

  wannaShowLoginButton(state) {
    setStyle(this.loginButton, {
      display: state ? 'block' : 'none',
    });
  }

  wannaShowUserDropdown(state) {
    setStyle(this.userDropdown, {
      display: state ? 'block' : 'none',
    });
  }

  wannaShowCartButton(state) {
    setStyle(this.cartButton, {
      display: state ? 'block' : 'none',
    });
  }
}
