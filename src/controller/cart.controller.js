import fs from 'fs'
import { v4 as cartID } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbCart = path.join(__dirname, '../database/cart.txt')
const dbProducts = path.join(__dirname, '../database/products.txt')

const administrador = true

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

const saveCart = async (req, res) => {        // Guarda un carrito nuevo

    try {
        const dbData = await readAndParseFile(dbCart)                                         // Nos traemos la info parseada a JSON del archivo leido
        const cart ={ id: cartID(), timestamp: Date.now(), products:[] }
        dbData.push(cart)                                                                    // Pusheamos el carrito en el array
        await fs.promises.writeFile(dbCart, JSON.stringify(dbData, null, 2), err => {        // Escribimos el archivo
            if(err) throw err
        })
        res.status(200).json({ messaje: `carrito creado con éxito, ID: ${cart.id}`})
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const deleteCartById = async (req, res) => {   // Esta funcion elimina un carrito segun su ID

    const { id } = req.params                                                                  // Tomamos el ID

    try {
        const dbData = await readAndParseFile(dbCart)
        const info = dbData.filter(cart => cart.id != id)                                      // Filtramos todos los carritos distintos de ese ID

        if (dbData.length > info.length) {
            await fs.promises.writeFile(dbCart, JSON.stringify(info, null, 2), err => {        // Escribimos la nueva db
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

const getProductsFromCart = async (req, res) => {

    const { id } = req.params
     try {
        const dbData = await readAndParseFile(dbCart)
        dbData.forEach(cart => {
            if (cart.id == id) {
                res.send(cart.products)
            }
        })
     } catch (error) {
        console.error(`El error es: ${error}`)
     }
}

const saveProductInCartByID = async (req, res) => {
    const { id } = req.params
    const { arrID } = req.body

    try {
        const dbDataProducts = await readAndParseFile(dbProducts)
        const infoProducts = []
        dbDataProducts.forEach(product => {
            arrID.forEach(id => {
                if (product.id == id) infoProducts.push(product)
            })  
        })
        if (infoProducts.length != 0) {
            const dbDataCart = await readAndParseFile(dbCart)
            dbDataCart.forEach( cart => {
                if (cart.id == id) {
                    cart.products = infoProducts
                }
            })
            await fs.promises.writeFile(dbCart, JSON.stringify(dbDataCart, null, 2), err => {
                if(err) throw err
            })
            res.status(200).json({ messaje: 'productos agregados con éxito'})
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const deleteProductFromCartByID = async (req, res) => {

    const { id , id_prod } = req.params

    try {
        const dbDataCart = await readAndParseFile(dbCart)
        const cartInfo = dbDataCart.filter( cart => cart.id == id )
        console.log(cartInfo[0])
        if (cartInfo.length != 0) {
            const newProducts = cartInfo[0].products.filter(product => product.id != id_prod)
            if (newProducts.length < cartInfo[0].products.length) {
                cartInfo[0].products = newProducts
                await fs.promises.writeFile(dbCart, JSON.stringify(dbDataCart, null, 2), err => {
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