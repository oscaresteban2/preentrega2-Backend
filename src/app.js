import express from 'express'; // creando la aplicacion de Express
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import http from "http";
import ProductManager from "./managers/gestorProductos.js";
import viewsRouter from './routes/views.router.js';
import { __dirname } from "./utils.js";

const app = express();
const server = http.createServer(app);
const productManager = new ProductManager(__dirname + "/files/products.json");
const PORT = 8080;
const io = new Server(server);

//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Motores de plantillas y visualizaciones:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/", viewsRouter);

//Esucha el server:
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);  //Se llama la Variable del puerto al que se va a escuchar la conexion
});

//Websockets

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado. ID: ", socket.id);
  

  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.agregarProducto(productData);
      io.emit("productAdded", newProduct);
    } catch (error) {
      console.log("Error al agregar el producto: ", error);
    }
  });

  socket.on("eliminar-producto", async (productId) => {
    try {
      await productManager.eliminarProductosPorId(productId);
      console.log(`Producto con id ${productId} eliminado`);

      // Actualizar la lista para todos los clientes
      const productsList = await productManager.obtenerProductos();
      io.emit("realtime", productsList);
    } catch (error) {
      console.log("Error al eliminar el producto:", error);
    }
  });

});