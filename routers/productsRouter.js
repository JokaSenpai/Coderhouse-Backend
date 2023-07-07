const express = require ('express');

const ProductManager = require ('../ProductManager');
const manager = new ProductManager("./products.json");

const { Router } = express; 

const productsRouter = Router();

productsRouter.get('/', (req, res) => {

    const limit = req.query.limit;

    if(!limit){
        manager.getProducts()
        .then((products) => {
            return res.send(products);
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.status(500).send("Internal Server Error");
        });
    } else {
        manager.getProducts()
        .then((products) => {

            if(limit > products.length){
                return res.send(`ERROR: la cantidad de productos registrados es ${products.length}`);
            }
            products.splice(limit,(products.length-limit))
            ///const filteredProducts = productsToFilter.splice(limit,(productsToFilter.length-limit))
            return res.send(products);
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.status(500).send("Error en servidor");
        });

    }

   

}); 

productsRouter.get('/:pId', (req, res) => {
    const pId = parseInt(req.params.pId);

    manager.getProductById(pId)
    .then((product) =>{
        return res.send(product)
    })
    .catch((error) =>{
        console.log("Error", error);
        return res.status(500).send("Error en servidor")
    })

})

productsRouter.post('/', (req, res) => {
    const product = req.body;

    manager.addProduct(product)
    .then((data) => {

        if (typeof data == "string"){
            return res.status(400).json(data)
        } else {
            return res.status(201).json(data)
        }
    
    })
    .catch(() =>{
        return res.status(500).json({"error": "usuario no creado"})
    })

})

productsRouter.put('/:pId', (req, res) => {
    const pId = parseInt(req.params.pId);
    const updateProduct = req.body;

    manager.updateProduct(pId,updateProduct)
    .then((data) => {
        
        if (typeof data === 'string'){
            return res.status(400).json(data)
        } else {
            return res.json(data);
        }

    })
    .catch(() =>{
        return res.status(500).json({"error": "Error en servidor"})
    })

})

productsRouter.delete('/:pId', (req, res) => {
    const pId = parseInt(req.params.pId);

    manager.deleteProduct(pId)
    .then((data) => {
        return res.json(data);
    })
    .catch(() => {
        return res.status(500).json({"error": "Error en servidor"})
    })
})

module.exports = productsRouter;