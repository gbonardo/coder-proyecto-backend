import { cartModel } from "../dao/models/carts.models.js"
import { productModel } from "../dao/models/products.models.js"


export const getCarts = async (req, res) => {
    try {
        const carts = await cartModel.find()
        res.status(200).send({ respuesta: 'OK', mensaje: carts })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error consultando carritos', mensaje: error })
    }
}


export const postCart = async (req, res) => {
    try {
        const cart = await cartModel.create({});

        if (cart) {
            res.status(200).send({ respuesta: 'Carrito Creado', mensaje: cart });
        } else {
            res.status(404).send({ respuesta: 'Error al crear Carrito', mensaje: 'Cart Not Found' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al crear Carrito', mensaje: error });
    }
}

export const getCartById = async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart)
            res.status(200).send({ respuesta: 'Ok', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'No encontrado' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
}

export const postCartById = async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)
            if (prod) {
                //const indice = cart.products.findIndex(item => item.id_prod === pid)
                const indice = cart.products.findIndex(item => item._id.toString() === pid)
                if (indice != -1) {
                    cart.products[indice].quantity += quantity
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity })
                }
                //const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
                const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products });
                res.status(200).send({ respuesta: 'Ok', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Producto no encontrado' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Carrito no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
    }
}

export const updateProductToCart = async (req, res) => {
    const { cid } = req.params
    const { products } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            throw new Error("Cart not found")
        }
        for (let prod of products) {
            const index = cart.products.findIndex(cartProduct => cartProduct.id_prod._id.toString() === prod.id_prod)
            if (index !== -1) {
                cart.products[index].quantity = prod.quantity
            } else {
                const exists = await productModel.findById(prod.id_prod)
                if (!exists) {
                    throw new Error(`Product with ID ${prod.id_prod} not found`)
                }
                cart.products.push(prod)
            }
        }
        await cart.save();
        res.status(200).send({ respuesta: 'OK', mensaje: 'Cart updated successfully' });
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
}

export const updatedQuantityProdToCart = async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const product = await productModel.findById(pid)
            if (product) {
                const index = cart.products.findIndex(cartProd => cartProd.id_prod._id.toString() == pid)
                if (index != -1) {
                    cart.products[index].quantity = quantity;
                    await cartModel.findByIdAndUpdate(cid, { products: cart.products })
                    res.status(200).send({ respuesta: 'ok', mensaje: `cantidad de producto con id ${product._id} actualizada con exito a ${quantity}` })
                } else {
                    res.status(404).send({ respuesta: 'error', mensaje: 'error, el producto no existe, no puedes actualizar la cantidad de productos no existentes, agregar el producto a carrito primero' })
                }
            }
        } else {
            res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'Carrito no existe' })
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'error al agregar producto al carrito', mensaje: error.message })
    }
}



export const deleteCart = async (req, res) => {
    const { cid } = req.params
    try {
        await cartModel.findByIdAndUpdate(cid, { products: [] })
        res.status(200).send({ respuesta: 'Ok', mensaje: 'Carrito vacio' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Carrito no encontrado', mensaje: error })
    }
}

export const deleteAndUpdateCartById = async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)
            if (prod) {
                //const indice = cart.products.findIndex(item => item.id_prod._id.toString() == pid)
                //if (indice !== -1) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toString() == pid)
                if (indice != -1) {
                    cart.products.splice(indice, 1)
                }
            }
        }
        //const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
        const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products });
        res.status(200).send({ respuesta: 'Ok', mensaje: respuesta })
    } catch (error) {
        res.status(400).send({ respuesta: 'Carrito no encontrado', mensaje: error })
    }
}