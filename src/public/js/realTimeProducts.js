//conectamos websockets del lado del cliente
const socket = io();

const FormNewProduct = document.getElementById("formularionuevoproducto");

FormNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(FormNewProduct);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  //enviamos los datos del producto al servidor
  socket.emit("newProduct", productData);
});

socket.on("productAdded", (newProduct) => {
  const productsList = document.getElementById("productsList");

  productsList.innerHTML += `<li>Titulo: ${newProduct.titulo}</li>
                             <li>Descripcion: ${newProduct.descripcion}</li>
                             <li>Precio: ${newProduct.precio}</li>
                             <li>Categoria: ${newProduct.categoria}</li>
                             <li>Codigo: ${newProduct.codigo}</li>
                             <li>Existencias: ${newProduct.existencias}</li><br>`;
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("button-delete")) {
    const productId = e.target.getAttribute("data-id");
    console.log("Id del producto a eliminar:", productId);


    socket.emit("eliminar-producto", productId);
  }
});

socket.on('realtime', (productsList) => {
  console.log('Productos actualizados:', productsList);

  const productsContainer = document.getElementById('productsList');

  // Limpiar el contenido actual
  productsContainer.innerHTML = '';

  // Recorrer cada producto y agregarlo al contenedor
  productsList.forEach(product => {
    productsContainer.innerHTML += `
      <li>Titulo: ${product.titulo}</li>
      <li>Descripcion: ${product.descripcion}</li>
      <li>Precio: ${product.precio}</li>
      <li>Categoria: ${product.categoria}</li>
      <li>Codigo: ${product.codigo}</li>
      <li>Existencias: ${product.existencias}</li><br>
      
      <button class="button-delete" data-id="${product.id}" type="button">Eliminar Producto</button><br><br>`;
  });

  // Después de renderizar los productos, volver a agregar los event listeners
  agregarEventosEliminar();  
});

function agregarEventosEliminar() {
  const deleteButtons = document.querySelectorAll('.button-delete');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      socket.emit('eliminar-producto', productId);
    });
  });
}