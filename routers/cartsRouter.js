const express = require ('express');

const ProductManager = require ('../ProductManager');
const manager = new ProductManager("./products.json");

const CartManager = require ('../CartManager');
const managerCart = new CartManager ("./carts.json");

const { Router } = express; 

const cartsRouter = Router();

cartsRouter.post('/', (req, res) => {

    managerCart.addCart()
    .then((data) =>{
        res.status(201).json(data);
    })
    .catch(() =>{
        return res.status(500).json({"Error": "El carrito ha podido ser creado"})
    })
});

cartsRouter.get('/:cId', (req,res) => {
const cId = parseInt(req.params.cId);

managerCart.getProductsCart(cId)
.then((data) => {

    if (typeof data == 'string'){
        return res.status(400).json(data)
    } else {
        return res.status(201).json(data)
    }

})
.catch(() =>{
    return res.status(500).json({"Error": "Error en el servidor"})
})
});

cartsRouter.post('/:cId/product/:pId', async(req,res) => {
  try {
    const cId = parseInt(req.params.cId);
    const pId = parseInt(req.params.pId);

    const product = await manager.getProductById(pId);
    if (typeof product == 'string'){
      return res.status(400).json(product)
    }
    const result = await managerCart.addProductToCart(product, cId);
    if (typeof result == 'string'){
      return res.status(400).json(result)
    } else {
      return res.status(201).json(result)
    }
  } catch (err) {
    return res.status(500).send("Error en servidor al tratar de agregar el producto");
  }
});
module.exports = cartsRouter;