import { el } from 'redom';

export default class CartModal {
  el;

  constructor(content) {
    this.el = el(
      'div.modal.fade#cartDetailModal',
      {
        'data-bs-backdrop': 'static',
        'data-bs-keyboard': 'false',
        'tab-index': '-1',
        'aria-labelledby': 'cartDetailModal',
        'aria-hidden': 'true',
      },
      [
        el('div.modal-dialog', [
          el('div.modal-content', [
            el('div.modal-header', [
              el('h1.modal-title.fs-5', 'Cart List'),
              el('button.btn-close', {
                'data-bs-dismiss': 'modal',
                'aria-label': 'Close',
              }),
            ]),
            el('div.modal-body', [content]),
            el('div.modal-footer', [
              el(
                'button.btn.btn-secondary',
                {
                  'data-bs-dismiss': 'modal',
                },
                'Close',
              ),
            ]),
          ]),
        ]),
      ],
    );
  }
}
