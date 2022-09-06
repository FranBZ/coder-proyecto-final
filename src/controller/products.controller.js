import fs from 'fs'
import { v4 as prodID } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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

const getProductById = async (req, res) => {  // Esta funcion devuelve un producto segun su ID
    const { id } = req.params
    try {
        const dbData = await readAndParseFile(dbProducts)                     // Nos traemos la info parseada a JSON de la db
        if (!id) {
            res.status(400).json({ error : 'porfavor ingrese un id' })
        } else {
            const info = dbData.find(product => product.id == id)             // Buscamos por ID y lo guardamos en una variable
            if (info) {                                                       // Comprobamos si existe informacion y retornamos
                res.send(info)
            } else { 
                res.status(400).json({ error : 'producto no encontrado' })
            }
        }
    
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const saveProduct = async (req, res) => {        // Guarda un prodcuto nuevo
    if (administrador == true) {
        const { name, price, urlImage, description, code, stock } = req.body                              // Tomamos el cuerpo
    
        if ( !name || !price || !urlImage || !description || !code || !stock ) {                          // Comprobamos que el cuerpo este completo
            res.status(400).json({ error : 'por favor ingrese todos los datos del producto' })   

        } else {                 
                                                                            
            const product = req.body                                                                      // Tomamos el cuerpo 

            try {
                const dbData = await readAndParseFile(dbProducts)                                         // Nos traemos la info parseada a JSON del archivo leido
                product.id = prodID()                                                                     // Insertamos el ID en el producto
                product.timeStamp = Date.now()                                                            // Insertamos el timeStamp
                dbData.push(product)                                                                      // Pusheamos el producto en el array
                await fs.promises.writeFile(dbProducts, JSON.stringify(dbData, null, 2), err => {         // Escribimos el archivo
                    if(err) throw err
                })
                res.status(200).json({ messaje: 'producto cargado con exito'})
            } catch (error) {
                console.error(`El error es: ${error}`)
            }
        }
    } else {
        res.status(400).json({ messaje: 'usted no tiene permisos para consultar esta url'})
    }
}

const updateProductByID = async (req, res) => {  // Recibe y actualiza un producto según su id.
    if (administrador == true) {
        const { id } = req.params                                                                   // Tomamos el ID
        const { name, price, urlImage, description, code, stock } = req.body                        // Tomamos el cuerpo
        
        if ( !name || !price || !urlImage || !description || !code || !stock ) {                    // Comprobamos que el cuerpo este completo
            res.status(400).json({ error : 'por favor ingrese todos los datos del producto' })                          
        } else {
            try {
                const dbData = await readAndParseFile(dbProducts)
                let contador = 0
                for ( let prod = 0; prod < dbData.length; prod++) {                    // Recorremos el array de productos, en caso que coincidan los ID lo actualizamos
                    if (dbData[prod].id == id) {
                        dbData[prod].name = name
                        dbData[prod].price = price
                        dbData[prod].urlImage = urlImage
                        dbData[prod].description = description
                        dbData[prod].code = code
                        dbData[prod].stock = stock
                        dbData[prod].timeStamp = Date.now()
                        contador += 1
                        break
                    }
                }
                if ( contador != 0 ) {
                    await fs.promises.writeFile(dbProducts, JSON.stringify(dbData, null, 2), err => {    // En caso de encontrar coincidencias escribimos el archivo
                        if(err) throw err
                    })
                    res.status(200).json({ messaje : 'producto actualizado con exito' })
                } else {
                    res.status(400).json({ error : 'producto no encontrado' })                           // En caso que no haya coincidencias retornamos el error
                }
            } catch (error) {
                console.error(`El error es: ${error}`)
            }
        }
    } else {
        res.status(400).json({ messaje: 'usted no tiene permisos para consultar esta url'})
    }
}

const deleteProductById = async (req, res) => {   // Esta funcion elimina un producto segun su ID
    if (administrador == true) {
        const { id } = req.params                                                                       // Tomamos el ID
        try {
            const dbData = await readAndParseFile(dbProducts)
            const pordIndex = dbData.findIndex(product => product.id == id)                             // Buscamos el producto por su id y tomamos el indice del array
            if ( pordIndex != -1) {                                                                     // Si encuentra 
                dbData.splice(pordIndex, 1)                                                             // Borra el producto
                await fs.promises.writeFile(dbProducts, JSON.stringify(dbData, null, 2), err => {       // Escribimos la nueva db
                    if(err) throw err
                })
                res.status(200).json({ messaje : 'producto borrado con exito' })
            } else {
                res.status(400).json({ error : 'producto no encontrado' })
            }

        } catch (error) {
            console.error(`El error es: ${error}`)
        }
    } else {
        res.status(400).json({ messaje: 'usted no tiene permisos para consultar esta url'})
    }
}

export const productsController = {
    getProductById,
    saveProduct,
    updateProductByID,
    deleteProductById
}