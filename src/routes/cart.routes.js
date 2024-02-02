import { Router } from "express";
import { deleteAndUpdateCartById, deleteCart, updateProductToCart, updatedQuantityProdToCart, getCartById, postCart, postCartById, getCarts } from "../controllers/cart.controllers.js";
import { purchaseCart } from "../controllers/orders.controllers.js";

const cartRouter = Router()

cartRouter.get('/', getCarts)
cartRouter.post('/', postCart)
cartRouter.get('/:cid', getCartById)
cartRouter.post('/:cid/products/:pid', postCartById)
cartRouter.put('/:cid', updateProductToCart)
cartRouter.put('/:cid/product/:pid', updatedQuantityProdToCart)
cartRouter.delete('/:cid', deleteCart)
cartRouter.delete('/:cid/products/:pid', deleteAndUpdateCartById)

cartRouter.get('/:cid/purchase', purchaseCart)

export default cartRouter