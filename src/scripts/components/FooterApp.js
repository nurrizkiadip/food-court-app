import { el } from 'redom';

export default class FooterApp {
  el;

  constructor() {
    this.el = el(
      'div.main-footer.bg-dark',
      el('div.container.px-3.py-4', [
        el(
          'p.text-center.text-white.mb-0',
          'Made with ❤ by Dicoding Indonesia',
        ),
      ]),
    );
  }
}
