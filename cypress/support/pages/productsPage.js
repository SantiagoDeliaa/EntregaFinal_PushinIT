export class ProductsPage {
    constructor() {
        this.productoShirt = '#blacktshirt';
        this.productoCup = '#redcup'
    };

    agregarProducto(producto) {
        cy.get(producto).click();
        cy.get('#closeModal').click();
    };
};