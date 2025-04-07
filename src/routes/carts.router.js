import { Router } from "express";
import CartManager from "../managers/cartsManager.js";
import { __dirname } from "../utils.js";

const manager = new CartManager(__dirname + "/files/carts.json");
const router = Router();

router.post('/', async (req, res) => {
    try {
        const cart = await manager.addCart();
        res.status(201).json({ message: 'Carrito creado', cart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// 2. Obtener carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const products = await manager.getProductsInCartById(cid);

        if (!products) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// 3. Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Cantidad inválida' });
        }

        const carts = await manager.addProductInCart(cid, pid, quantity);
        res.status(200).json({ message: 'Producto agregado al carrito', carts });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;