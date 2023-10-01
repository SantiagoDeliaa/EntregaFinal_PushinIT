/// <reference types="cypress" />

import { ProductsPage } from "../support/pages/productsPage";
import { ShoppingCartPage } from "../support/pages/shoppingCartPage";;

describe("Pre Entrega", () => {
    let datos;
    let datos2;
    const productsPage = new ProductsPage
    const shoppingCartPage = new ShoppingCartPage
    const randomNumber = Math.floor(Math.random()*1000);
    const username = `santitest${randomNumber}`;

    before('Before', () => {
        cy.fixture('archivoFixture').then(archivoFixtureParametro => {
            datos = archivoFixtureParametro;
        })

        cy.fixture('datosCheckout.json').then(datosCheckout => {
            datos2 = datosCheckout;
        })
    })

    it('entrega', () => {
        const password = '123456!';
        const passEncript = 'b7dfe9134c7a717a3b6eaf37bdc1ef7b';
        const gender = 'male';
        const day = '28';
        const month = 'August';
        const year = '1998';
        //------
        const precioProducto1 = datos.productos.producto1.price;
        const precioProducto2 = datos.productos.producto2.price;
        const sumaPrecios = parseFloat(precioProducto1) + parseFloat(precioProducto2);


        cy.request({
            url: "https://pushing-it.onrender.com/api/register",
            method: "POST",
            body: {
                username : username,
                password: password,
                gender: gender,
                day: day,
                month: month,
                year: year
            }
        }).then(respuesta => {
            expect(respuesta.status).to.be.equal(200)
            expect(respuesta.body.newUser.username).to.be.equal(username)
            expect(respuesta.body.newUser.password).to.be.equal(passEncript)
            expect(respuesta.body.newUser.gender).to.be.equal(gender)
            expect(respuesta.body.newUser.day).to.be.equal(day)
            expect(respuesta.body.newUser.month).to.be.equal(month)
            expect(respuesta.body.newUser.year).to.be.equal(year)
        })

        cy.request ({
            url: "https://pushing-it.onrender.com/api/login",
            method: 'POST',
            body : {
                'username' : username,
                'password' : password
            }
        }).then(respuesta =>{
            expect(respuesta.status).to.be.equal(200);
            window.localStorage.setItem('token', respuesta.body.token)
            window.localStorage.setItem('user', respuesta.body.username)
            cy.visit('')
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
            cy.contains('Go to Checkout').click();
            cy.get('#FirstName').type(datos2.checkout.name);
            cy.get('#lastName').type(datos2.checkout.lastname);
            cy.get('#cardNumber').type(datos2.checkout.creditCard);
            cy.contains('Purchase').click();
            cy.get('#name',{timeout: 10000}).should('include.text', datos2.checkout.name+' '+datos2.checkout.lastname);
            cy.get('#creditCard').should('include.text', datos2.checkout.creditCard);
            cy.get('#totalPrice').should('include.text', sumaPrecios.toString());
            cy.xpath('//*[@id="Black T-Shirt"]').should('include.text', datos.productos.producto1.name);
            cy.xpath('//*[@id="Red Cap"]').should('include.text', datos.productos.producto2.name);
            cy.contains('Thank you').click();
        })
    })

    after('After delete User', () => {
        cy.log("After")
        cy.request({
            method : "DELETE",
            url: `https://pushing-it.onrender.com/api/deleteuser/${username}`,
            failOnStatusCode : false
        }).then(respuesta => {
            cy.log(respuesta.body)
            expect(respuesta.status).to.be.equal(200);
        })
    })
});

