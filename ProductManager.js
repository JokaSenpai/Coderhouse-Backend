const { log } = require("console");
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  addProduct(data) {
    
    if (
      data.title === undefined ||
      data.description === undefined ||
      data.price === undefined ||
      data.code === undefined ||
      data.stock === undefined ||
      data.category === undefined 
    ) {
      return console.log("Error: Por favor ingrese todos los campos");
    }

    const product = {
      title: data.title,
      description: data.description,
      price: data.price,
      thumbnail: [data.thumbnail],
      code: data.code,
      stock: data.stock,
      category: data.category
    };    

    return fs.promises.readFile(this.path, "utf-8")
      .then((content) => {

        if (fs.existsSync(this.path)) {
          this.products = JSON.parse(content);
        }

        const exist = this.products.find((el) => el.code === product.code);

        if (!exist) {
          
          const assignId = { id: this.products.length + 1 } ;
          const status = {status: true};
          const productoNuevo = ({...assignId, ...product, ...status});

          this.products.push( productoNuevo );
          
          const productoNuevoString = JSON.stringify(this.products, null, 2);

          return fs.promises.writeFile(this.path, productoNuevoString)
          .then(()=>{
            console.log(`Producto: ${productoNuevo.title} agregado correctamente`);
            return productoNuevo;
          })

        } else {
          const mensajeError = `El producto con codigo: ${product.code} ya existe`;
          return mensajeError
        }

      })
      .catch(() => {
        const assignId = { id: this.products.length + 1 } ;
        const status = {status: true};

        const productoNuevo = ({...assignId, ...product, ...status});

        this.products.push( productoNuevo );

        const productoNuevoString = JSON.stringify(this.products, null, 2);
        return fs.promises.writeFile(this.path, productoNuevoString)
        .then(() =>{
          return productoNuevo;
        })
      });

  }

  getProducts () {

    return fs.promises.readFile(this.path, "utf-8")
    .then((content) => {

      this.products = JSON.parse(content);
      return this.products

    })
    .catch (()=> {
      return console.log(this.products);
    })
      
  }

  getProductById (id) {

    return fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      this.products = JSON.parse(content);

      const productById = this.products.find(el => el.id === id);

      if (!productById){
        const mensaje = `Error: Producto: ${id} - no encontrado`
        return mensaje;

      } else {
        return productById;

      }
      
    })
    .catch((err) => {
      console.log(`El archivo "${this.path}" no existe`); 
      return err
    })

      
  }

  updateProduct(id,updateField){

    return fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      if (fs.existsSync(this.path)) {
        this.products = JSON.parse(content);
      }

      const productToUpdate = this.products.find(el => el.id === id)

      if(updateField.id){
        const mensajeError = "No se puede actualizar el ID ingresado"
        return mensajeError
      }

        if (!productToUpdate) {
          const mensajeError = `No existen productos con el ID: "${id}" registrado o el archivo "${this.path}" aun no ha sido creado`;
          return mensajeError
        }

        const updatedProduct = {
          id: id,
          title: updateField.title || productToUpdate.title,
          description: updateField.description || productToUpdate.description,
          price: updateField.price || productToUpdate.price,
          thumbnail: [updateField.thumbnail] || [productToUpdate.thumbnail],
          code: updateField.code || productToUpdate.code,
          stock: updateField.stock || productToUpdate.stock,
          category: updateField.category || productToUpdate.category,
          status: updateField.status || productToUpdate.status
        }
  
        const index = this.products.findIndex(el => el.id === id);
  
        this.products[index] = updatedProduct;

        return fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        .then(() => {
          console.log(`El producto con ID: "${id}" ha sido correctamente actualizado`);
          return updatedProduct
        })

    })
    .catch((err) =>{
      return err;
    })

  }

  deleteProduct(id){

    return fs.promises.readFile(this.path, "utf-8")
    .then((content) => {
      this.products = JSON.parse(content);

      const deleteProduct = this.products.findIndex(el => id === el.id);

      if(deleteProduct !== -1) {

        this.products.splice(deleteProduct,1);

        return fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        .then(()=>{
          const mensaje = `El producto de ID: ${id} - ha sido eliminado correctamente`;
          return mensaje;
        })
      } else {
        const mensaje = `No existe ningun producto con ID: ${id} dentro del archivo "${this.path}" o el archivo aun no ha sido creado.`;
         return mensaje;
      }
    })
    .catch((err) => {
      return err;
    })
  }
}
module.exports = ProductManager;





