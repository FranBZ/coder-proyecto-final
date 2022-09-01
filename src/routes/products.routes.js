import { Router } from "express"
import { productsController } from "../controller/products.controller.js"

const productsRouter = Router()

// El router base '/api/productos' implementará cuatro funcionalidades:

//1. GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto  por su id (disponible para usuarios y administradores)
productsRouter.get('/:id?', productsController.getProductById)

//2. POST: '/' - Para incorporar productos al listado (disponible para administradores)
productsRouter.post('/', productsController.saveProduct)

//3. PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
productsRouter.put('/:id', productsController.updateProductByID)

//4. DELETE: '/:id' - Borra un producto por su id (disponible para administradores)
productsRouter.delete('/:id', productsController.deleteProductById)

export default productsRouter