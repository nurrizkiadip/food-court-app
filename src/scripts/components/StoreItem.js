import { el } from 'redom';
import { limitText } from '../Utils';
import router from '../router';

export default class StoreItem {
  el;

  link;

  constructor({ name, image, description, to }) {
    this.el = el('div.card.h-100', [
      el('img.card-img-top', {
        src: image || 'https://placeimg.com/720/400/tech',
      }),
      el('div.card-body', [
        el('h5.card-title', name),
        el('p', limitText(description)),
        el(
          'div.d-flex.justify-content-end',
          (this.link = el(
            'a.btn.btn-outline-primary',
            { 'data-navigo': '', 'href': to },
            'Visit',
          )),
        ),
      ]),
    ]);

    this.link.addEventListener('click', (event) => {
      event.preventDefault();

      router.navigate(to, {
        updateBrowserURL: true,
      });
    });
  }
}
