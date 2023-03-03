import { el, setAttr } from 'redom';

export default class AddToCardButton {
  el;

  constructor(text, callback) {
    this.el = el(
      'button.btn.btn-link.text-decoration-none',
      {
        onclick: callback,
      },
      text,
    );
  }

  setEnabled(enabled) {
    setAttr(this.el, { disabled: !enabled });
  }
}
