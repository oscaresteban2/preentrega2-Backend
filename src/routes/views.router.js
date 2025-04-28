import express from "express";
import ProductManager from "../managers/gestorProductos.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/files/products.json");

viewsRouter.get("/", async (req, res) => {
    try {
        const productos = await productManager.obtenerProductos();
        res.render("home", { productos });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await productManager.obtenerProductos();
        res.render("realTimeProducts", { productos });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
export default viewsRouter;