// Import our custom CSS
import '../styles/main.scss';

// Import javascript file as needed
import * as bootstrap from 'bootstrap';
import router from './router';

const initPages = () => {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  if (header && main && footer) {
    main.style.minHeight = `calc(100vh - ${
      header.clientHeight + footer.clientHeight
    }px)`;
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  router.resolve();
});

window.addEventListener('load', () => {
  initPages();
});
