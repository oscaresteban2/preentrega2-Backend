import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Generar nuevo ID
  generateNewId = (carts) => {
    if (carts.length > 0) {
      return carts[carts.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  // Leer archivo JSON
  readCartsFile = async () => {
    try {
      // Verifica si el archivo existe
      await fs.promises.access(this.path);
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, lo crea con un array vacío
      if (error.code === 'ENOENT') {
        await this.saveCartsFile([]);
        return [];
      } else {
        throw error; // Otros errores sí se lanzan
      }
    }
  };

  // Guardar archivo JSON
  saveCartsFile = async (carts) => {
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
  };

  //Crear nuevo carrito
  addCart = async () => {
    const carts = await this.readCartsFile();
    const newCart = {
      id: this.generateNewId(carts),
      products: []
    };
    carts.push(newCart);
    await this.saveCartsFile(carts);
    return newCart;
  }

  // Obtener carrito por ID
  getCartById = async (cid) => {
    const carts = await this.readCartsFile();
    const cart = carts.find(c => c.id === cid);
    return cart || null;
  };

  // Obtener productos de un carrito
  getProductsInCartById = async (cid) => {
    const cart = await this.getCartById(cid);
    return cart ? cart.products : null;
  }

  // Agregar producto a un carrito
  addProductInCart = async (cid, pid, quantity) => {
    const carts = await this.readCartsFile();
    const cartIndex = carts.findIndex(c => c.id === cid);

    if (cartIndex === -1) return null; // carrito no encontrado

    const cart = carts[cartIndex];
    const existingProduct = cart.products.find(p => p.id === pid);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: pid, quantity });
    }

    carts[cartIndex] = cart;
    await this.saveCartsFile(carts);
    return cart;
  };
};



