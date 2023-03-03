import { el, setChildren, setStyle } from 'redom';
import NavList from '../components/NavList';

export default class NavApp {
  el;

  hamburgerButton;

  navContainer;

  brandImage;

  navListEl;

  constructor({ brandName }) {
    this.hamburgerButton = el(
      'button.navbar-toggler',
      {
        'type': 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': '#navbarSupportedContent',
      },
      el('span.navbar-toggler-icon'),
    );

    this.brandImage = el('img.d-inline-block.align-text-top', {
      src: '/images/guy_fireats.png',
      alt: brandName,
    });

    this.navContainer = el(
      'div.collapse.navbar-collapse#navbarSupportedContent',
    );

    this.navListEl = new NavList();

    /*Set a couple of nav items to nav list*/
    setChildren(this.navContainer, [this.navListEl]);

    this.el = el(
      'nav.navbar.fixed-top.navbar-expand-md.shadow',
      el('div.container', [
        /*Brand name*/
        el('div.navbar-brand.m-0.h1.fs-3.d-flex.align-items-center', [
          this.brandImage,
          el('span.ms-3', brandName),
        ]),

        /*Hamburger button*/
        this.hamburgerButton,

        /*List of nav item*/
        this.navContainer,
      ]),
    );

    setStyle(this.brandImage, {
      height: '60px',
    });
  }
}
