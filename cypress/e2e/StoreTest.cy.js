/* eslint-disable cypress/unsafe-to-chain-command */
import { slowCypressDown } from 'cypress-slow-down';
import { makeServer } from '../../src/miragejs/server';
// import { sleepTime } from '../../src/utils/helpers';

// it.only -> executa apenas o teste
// context.only -> executa apenas o contexto

context('StoreTest', () => {
  slowCypressDown(1000);

  let server;
  const g = cy.get;
  const gid = cy.getByTestId;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    cy.visit('/');

    g('body').contains('Brand');
    g('body').contains('Wrist Watch');
  });

  context.only('Store > Shopping Cart', () => {
    const quantity = 10;

    beforeEach(() => {
      server.createList('product', quantity);
      cy.visit('/');
    });

    it('should not display shopping cart when page first loads', () => {
      g('[data-cy="shopping-cart"]').should('have.class', 'hidden');
    });

    it('should toogle shopping cart visibility when button is clicked', () => {
      g('[data-cy="shopping-cart"]').should('have.class', 'hidden');
      g('[data-cy="toggle-button"]').as('toggleButton');
      g('@toggleButton').click();
      g('[data-cy="shopping-cart"]').should('not.have.class', 'hidden');

      g('@toggleButton').click({ force: true });
      g('[data-cy="shopping-cart"]').should('have.class', 'hidden');
    });

    it('should not display "Clear cart" button when cart is empty', () => {
      gid('toggle-button').as('toggleButton');
      g('@toggleButton').click();

      // oculto mas visivel no htmnl
      // cy.get('[data-testid="clear-cart-button"]').should('not.be.visible');

      cy.get('[data-testid="clear-cart-button"]').should('not.exist');
    });

    it('should display "Cart is empty" message when there are no products', () => {
      gid('toggle-button').as('toggleButton');
      g('@toggleButton').click();
      gid('shopping-cart').contains('Cart is empty');
    });

    it('should open shopping cart when a product is added', () => {
      g('[data-testid="add-to-cart-button"]').first().click();
      g('[data-cy="shopping-cart"]').should('not.have.class', 'hidden');
    });

    it('should add first product to the cart', () => {
      g('[data-testid="add-to-cart-button"]').first().click();
      g('[data-testid="cart-item"]').should('have.length', 1);
    });

    it('should add 3 products to the cart', () => {
      g('[data-testid="add-to-cart-button"]').eq(1).click({ force: true });
      g('[data-testid="add-to-cart-button"]').eq(3).click({ force: true });
      g('[data-testid="add-to-cart-button"]').eq(5).click({ force: true });
      g('[data-testid="cart-item"]').should('have.length', 3);
    });

    it('should add 1 product to the cart', () => {
      cy.addToCart({ index: 6 });
      gid('cart-item').should('have.length', 1);
    });

    it('should add all products to the cart', () => {
      cy.addToCart({ indexes: 'all' });
      gid('cart-item').should('have.length', quantity);
    });

    it('should display quantity 1 when product is added to cart', () => {
      cy.addToCart({ index: 1 });
      gid('quantity').contains(1);
    });

    it('should increase quantity when button + gets clicked', () => {
      cy.addToCart({ index: 1 });
      gid('+').click();
      gid('quantity').contains(2);
      gid('+').click();
      gid('quantity').contains(3);
    });

    it('should decrease quantity when button - gets clicked', () => {
      cy.addToCart({ index: 1 });
      gid('+').click();
      gid('+').click();
      gid('quantity').contains(3);
      gid('-').click();
      gid('quantity').contains(2);
      gid('-').click();
      gid('quantity').contains(1);
    });

    it('should not decrease below zero when button - gets clicked', () => {
      cy.addToCart({ index: 1 });
      gid('-').click();
      gid('-').click();
      gid('quantity').contains(0);
    });

    it('should remove a product from cart', () => {
      cy.addToCart({ index: 2 });

      gid('cart-item').as('cartItems');
      g('@cartItems').should('have.length', 1);
      g('@cartItems').first().find('[data-testid="remove-button"]').click();
      g('@cartItems').should('have.length', 0);
    });

    it('should clear cart when "Clear cart" button is clicked', () => {
      cy.addToCart({ indexes: [1, 2, 3] });

      gid('cart-item').should('have.length', 3);
      gid('clear-cart-button').click();
      gid('cart-item').should('have.length', 0);
    });
  });

  context('Store > Product List', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should display "0 products " when no product is returned', () => {
      cy.get('[data-cy="product-card"]').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });

    it('should display "1 Product " when 1 roduct is returned', () => {
      server.createList('product', 1);
      cy.get('[data-cy="product-card"]').should('have.length', 1);
      cy.get('body').contains('1 Product');
    });

    it('should display "10 Product " when 10 roducts is returned', () => {
      server.createList('product', 10);
      cy.get('[data-cy="product-card"]').should('have.length', 10);
      cy.get('body').contains('10 Products');
    });
  });

  context('Store > Search for Products', () => {
    const quantity = 10;

    beforeEach(() => {
      server.createList('product', quantity);
      cy.visit('/');
    });

    it('should return 1 product when "Relógio bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
        description: 'Relógio bonito',
      });

      // cy.get('input[type="search"]');

      cy.get('[data-cy="input-search"]').type('Relógio bonito');
      // .should('have.value', 'Relógio bonito');

      cy.get('[data-cy="form-search"]').submit();

      cy.get('[data-cy="product-card"]').should('have.length', 1);
    });

    it('should not return any product', () => {
      // cy.get('input[type="search"]');

      cy.get('[data-cy="input-search"]').type('Relógio bonito');
      // .should('have.value', 'Relógio bonito');

      cy.get('[data-cy="form-search"]').submit();

      cy.get('[data-cy="product-card"]').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
  });
});
