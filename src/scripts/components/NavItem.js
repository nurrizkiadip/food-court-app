import { el } from 'redom';

export default class NavItem {
  el;

  constructor({ text, to, target = '_self', isNavigoActive = null }) {
    this.el = el('li.nav-item', [
      el(
        'a.nav-link',
        { href: to, target: target, 'data-navigo': isNavigoActive },
        text,
      ),
    ]);
  }
}
