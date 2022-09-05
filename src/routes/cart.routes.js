import { Router } from "express"
import { cartControllers } from "../controller/cart.controller.js"

const cartRouter = Router()

//* El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:

//1. POST: '/' - Crea un carrito y devuelve su id.
cartRouter.post('/', cartControllers.saveCart)

//2. DELETE: '/:id' - Vacía un carrito y lo elimina.
cartRouter.delete('/:id', cartControllers.deleteCartById)

//3. GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
cartRouter.get('/:id/productos', cartControllers.getProductsFromCart)

//4. POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
cartRouter.post('/:id/productos', cartControllers.saveProductInCartByID)

//5. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
cartRouter.delete('/:id/productos/:id_prod', cartControllers.deleteProductFromCartByID)

export default cartRouter