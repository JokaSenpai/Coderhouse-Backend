const fs = require("fs");

class CartManager {
  constructor(path) {
    this.cart = [];
    this.path = path;
  }

  addCart() {
    return fs.promises.readFile(this.path, "utf-8")
    .then((content) => {
      if (fs.existsSync(this.path)) {
        this.cart = JSON.parse(content);
      }

      const carritoNuevo = {
        id: this.cart.length + 1,
        products: [],
      };

      this.cart.push(carritoNuevo);

      const carritoString = JSON.stringify(this.cart, null, 2);

      return fs.promises.writeFile(this.path, carritoString)
      .then(() => {
        return carritoNuevo;
      });
    })
    .catch(() => {
        const carritoNuevo = {
            id: this.cart.length + 1,
            products: [],
          };
    
          this.cart.push(carritoNuevo);
    
          const carritoString = JSON.stringify(this.cart, null, 2);
    
          return fs.promises.writeFile(this.path, carritoString)
          .then(() => {
            return carritoNuevo;
          });
    })
  }

  getProductsCart(cartId) {

    return fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      this.cart = JSON.parse(content);

      const cartById = this.cart.find(el => el.id === cartId);

      const productosCarrito = cartById.products;

      if (!cartById){
        const mensaje = `Error: Carrito: ${id} - no encontrado!`
        return mensaje;

      } else {
        return productosCarrito;

      }
      
    })
    .catch(() => {
      const mensaje = "El Id buscado no existe"; 
      return mensaje
    })

  }

  addProductToCart(product, cartId) {

    return fs.promises.readFile(this.path, "utf-8")
    .then((content) => {
        
        if (fs.existsSync(this.path)) {
          this.cart = JSON.parse(content);
        }

        const cartById = this.cart.find(el => el.id === cartId);

        if (!cartById){
            const mensaje = `No existe el carrito con ID ${cartId}`
            console.log(mensaje);
            return mensaje;
        }

        const existProduct = cartById.products.find((el) => el.id === product.id);

        if (!existProduct){

            cartById.products.push({
                id: product.id,
                quantity: 1
            })

            const index = this.cart.findIndex(el => el.id === cartId);
  
            this.cart[index] = cartById;
            
            return fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, 2))
            .then(() => {
            console.log(`El carrito con ID: "${cartId}" se ha actualizado OK!`);
            return this.cart[index];
            })

        } else {

            const updateProductQty = {
                id: existProduct.id,
                quantity: existProduct.quantity + 1 
            }

            const cartIndex = this.cart.findIndex(el => el.id === cartId);

            const productIndex = cartById.products.findIndex(el => el.id === product.id);

            this.cart[cartIndex].products[productIndex] = updateProductQty;

            return fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, 2))
            .then(() => {
            console.log(`El carrito con ID: "${cartId}" ha sido correctamente actualizado`);
            return this.cart[cartIndex];
            });

        }

    })
    .catch(()=>{
        console.log(`Error`);
    })

  }
}

module.exports = CartManager;

