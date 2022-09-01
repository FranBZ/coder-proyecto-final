import { v4 as cartID } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbCart = path.join(__dirname, 'database/cart.txt')
const dbProducts = path.join(__dirname, 'database/products.txt')

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
        dbCart.push(cart)                                                                    // Pusheamos el producto en el array
        await fs.promises.writeFile(dbCart, JSON.stringify(dbData, null, 2), err => {        // Escribimos el archivo
            if(err) throw err
        })
        res.status(200).json({ messaje: 'carrito creado con exito'})
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const deleteCartById = async (req, res) => {   // Esta funcion elimina un producto segun su ID

    const { id } = req.params                                                               // Tomamos el ID

    try {
        const dbData = await readAndParseFile(dbCart)
        const info = dbData.filter(cart => cart.id != id)                                      // Filtramos todos los carritos distintos de ese ID

        await fs.promises.writeFile(dbProducts, JSON.stringify(info, null, 2), err => {        // Escribimos la nueva db
            if(err) throw err
        })
        res.status(200).json({ messaje: 'carrito borrado con exito'})

    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const getProductsFromCart = async (req, res) => {

    const { id } = req.params
     try {
        const dbData = await readAndParseFile(dbCart)
        const cartInfo = dbData.filter(cart => cart.id == id)
        if (cartInfo.length != 0) {
            res.send(cartInfo.products)
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }
     } catch (error) {
        console.error(`El error es: ${error}`)
     }
}

const saveProductInCartByID = async (req, res) => {
    /* const { id } = req.params
    const idProduct = req.body.id

    try {

        const dbDataProducts = await readAndParseFile(dbProducts)
        const infoProducts = dbDataProducts.filter(product => product.id == idProduct)
        if (infoProducts.length != 0) {
            try {
                const dbDataCart = readAndParseFile(dbCart)
                const cartInfo =
            } catch (error) {
                
            }
        }
        
    } catch (error) {
        
    } */
}

const deleteProductFromCartByID = async (req, res) => {

}

export const cartControllers = {
    saveCart,
    deleteCartById,
    getProductsFromCart,
    saveProductInCartByID,
    deleteProductFromCartByID
}