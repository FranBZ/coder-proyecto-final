import fs from 'fs'
import { v4 as cartID } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbCart = path.join(__dirname, '../database/cart.txt')
const dbProducts = path.join(__dirname, '../database/products.txt')

const readAndParseFile = async (file) => {  // Esta funcion se utiliza para leer el archivo y parsear a JSON la informacion, para su posterior uso

    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) => {         // Consultamos por la informacion
            if(err) throw err
            return data
        })
        return JSON.parse(data)                                                         // Retornamos la informacion parseada
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const saveCart = async (req, res) => {    // Esta funcion guarda un carrito nuevo

    try {
        const dbData = await readAndParseFile(dbCart)                                        // Nos traemos la info parseada a JSON del archivo leido
        const cart ={ id: cartID(), timestamp: Date.now(), products:[] }                     // Creamos el carrito
        dbData.push(cart)                                                                    // Pusheamos el carrito en el array
        await fs.promises.writeFile(dbCart, JSON.stringify(dbData, null, 2), err => {        // Reescribimos la base de datos
            if(err) throw err
        })
        res.status(200).json({ messaje: `carrito creado con éxito, ID: ${cart.id}`})
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const deleteCartById = async (req, res) => {   // Esta funcion elimina un carrito segun su ID

    const { id } = req.params                                                                   // Tomamos el ID

    try {
        const dbData = await readAndParseFile(dbCart)
        const indexCart = dbData.findIndex(cart => cart.id == id)                               // Buscamos el carrito por su ID
        if (indexCart != -1) {                                                                  // Si existe
            dbData.splice(indexCart, 1)                                                         // Borramos el carrito
            await fs.promises.writeFile(dbCart, JSON.stringify(dbData, null, 2), err => {       // Reescribimos la base de datos
                if(err) throw err
            })
            res.status(200).json({ messaje: 'carrito borrado con éxito'})
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }

    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const getProductsFromCart = async (req, res) => { // Esta funcion muestra todos los productos de un carrito

    const { id } = req.params                                // Tomamos el ID
     try {
        const dbData = await readAndParseFile(dbCart)
        dbData.forEach(cart => {
            if (cart.id == id) {                             // Si el id del carrito coincide con el enviado  
                res.send(cart.products)                      // Enviamos la informacion
            }
        })
     } catch (error) {
        console.error(`El error es: ${error}`)
     }
}

const saveProductInCartByID = async (req, res) => { // Esta funcion guarda un producto en un carrito
    const { id } = req.params                                           // Tomamos el ID
    const { arrID } = req.body                                          // Tomamos el array de productos a guardar

    try {
        const dbDataCart = await readAndParseFile(dbCart)
        const cartIndex = dbDataCart.findIndex(cart => cart.id == id)   // Buscamos el carrito por su ID
        if (cartIndex != -1) {                                          // Si encuentra un carrito que proceda a buscar y cargar los productos
            const dbDataProducts = await readAndParseFile(dbProducts)
            const infoProducts = []
            dbDataProducts.forEach(product => {                         // Si los IDs coinciden con los productos los vamos guardando en el array
                arrID.forEach(id => {
                    if (product.id == id) infoProducts.push(product)
                })  
            })
            if (infoProducts.length != 0) {                                       // Si existen productos en el array procedemos a cargar el carrito
                let union = dbDataCart[cartIndex].products.concat(infoProducts)   
                dbDataCart[cartIndex].products = union
                await fs.promises.writeFile(dbCart, JSON.stringify(dbDataCart, null, 2), err => {   // Reescribimos la base de datos
                    if(err) throw err
                })
                res.status(200).json({ messaje: 'productos agregados con éxito'})
            } else {
                res.status(400).json({ error: 'productos no encontrados'})
            }
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const deleteProductFromCartByID = async (req, res) => { // Esta funcion borra un producto de un carrito

    const { id , id_prod } = req.params

    try {
        const dbDataCart = await readAndParseFile(dbCart)
        const cartInfo = dbDataCart.find( cart => cart.id == id )                                   // Buscamos el carrito por ID
        if (cartInfo) {                                                                             // En caso de encontrarlo
            const prodIndex = cartInfo.products.findIndex(product => product.id == id_prod)         // Buscamos el indice del producto en el array
            if (prodIndex != -1) {                                                                  // En caso de encontra run producto lo borramos
                cartInfo.products.splice(prodIndex, 1)
                await fs.promises.writeFile(dbCart, JSON.stringify(dbDataCart, null, 2), err => {   // Reescribimos la base de datos
                    if(err) throw err
                })
                res.status(200).json({ messaje: 'producto borrado con éxito'})
            } else {
                res.status(400).json({ error: 'producto no encontrado'})
            }
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }
        
    } catch (error) {
        
    }
}

export const cartControllers = {
    saveCart,
    deleteCartById,
    getProductsFromCart,
    saveProductInCartByID,
    deleteProductFromCartByID
}