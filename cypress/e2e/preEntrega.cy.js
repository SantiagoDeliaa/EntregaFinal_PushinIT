/// <reference types="cypress" />

import { ProductsPage } from "../support/pages/productsPage";
import { ShoppingCartPage } from "../support/pages/shoppingCartPage";

describe("Pre Entrega", () => {
    let datos;
    let datos2;
    const productsPage = new ProductsPage
    const shoppingCartPage = new ShoppingCartPage

    before('Before', () => {
        cy.fixture('archivoFixture').then(archivoFixtureParametro => {
            datos = archivoFixtureParametro;
        })

        cy.fixture('datosLogin.json').then(datosLogin => {
            datos2 = datosLogin;
        })
    })

    beforeEach('BeforeEach', () => {
        cy.visit('');
        cy.get('[id="registertoggle"]').dblclick();
        cy.get('#user').type(datos2.login.user);
        cy.get('input#pass').type(datos2.login.pass);
        cy.contains('Log in').click();
    });


    it('Agregar dos productos y realizar respectivas validaciones', () => {
        const precioProducto1 = datos.productos.producto1.price;
        const precioProducto2 = datos.productos.producto2.price;
        const sumaPrecios = parseFloat(precioProducto1) + parseFloat(precioProducto2);

        cy.get(':nth-child(5) > .chakra-text').click();
        productsPage.agregarProducto('#blacktshirt')
        productsPage.agregarProducto('#redcup')
        cy.get('#goShoppingCart').click();
        shoppingCartPage.validarProducto(datos.productos.producto1.name);
        shoppingCartPage.validarProducto(datos.productos.producto2.name);
        shoppingCartPage.validarPrecio(datos.productos.producto1.name, datos.productos.producto1.price);
        shoppingCartPage.validarPrecio(datos.productos.producto2.name, datos.productos.producto2.price);
        cy.xpath('//*[@id="root"]/div/div[2]/div[2]/button').click();
        cy.get('#price').should('have.text', sumaPrecios.toString());
    });

});