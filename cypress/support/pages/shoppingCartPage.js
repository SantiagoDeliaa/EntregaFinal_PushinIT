export class ShoppingCartPage {

    validarProducto(producto) {
        cy.get(`[name="${producto}"]`) 
            .contains(producto)
            .should('exist')
            .invoke('text') 
            .then((Text) => {
                assert.equal(Text, producto);
            });
    }

    validarPrecio(producto, precio) {
        cy.get(`[name="${producto}"]`) 
            .siblings(`[id="productPrice"]`)
            .should('exist') 
            .invoke('text')
            .then((Text) => {
            const precioSinSimbolo = Text.replace('$', '');
            assert.equal(precioSinSimbolo, precio); 
        });
    }
}