// Obtener referencia con datos del usuario
let userId = document.getElementById('user-id').textContent;
let userRole = document.getElementById('user-role').textContent;


// Función para actualizar la lista de productos en la página web en 'localhost:8080/realtimeproducts'
const updateProductList = (products) => {
  let productListContainer = document.getElementById("products-list-container");
  let productsList = '<div class="row">';

  products.docs.forEach((product) => {
    productsList += `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
              <img src="./img/productos/${product.thumbnails[0]}" class="card-img-top img-fluid" alt="${product.nombre}" style="object-fit: contain; height: 100px;margin-bottom: 20px;">
              <h6 class="card-title"><strong>${product.nombre}</strong></h6>
              <div class="row">
                <h6 class="card-text">Precio: <strong>${product.precio}</strong></h6>
                <h6 class="card-text">Stock: ${product.stock}</h6>
                <h6 class="card-text">Categoria: ${product.categoria}</h6>
              </div>
          </div>
          <div class="card-footer">
            <h7 class="card-subtitle mb-2 text-muted">Product ID: ${product._id}</h7>
          </div>
        </div>
      </div>`;
  });

  productsList += '</div>';

  productListContainer.innerHTML = productsList;
}

//#AGREGAR UN PRODUCTO
// Obtener referencia al formulario y agregar un evento para cuando se envíe
let form = document.getElementById("formProduct");
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitar que el formulario recargue la página

  // Crear un objeto FormData y agregar todos los campos del formulario
  let formData = new FormData(form);

  try {
    // Crear una solicitud POST
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData, // Enviar los datos del formulario como FormData
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const product = await response.json(); // Obtener el producto de la respuesta

    if (response.status == 201) {
      socketCliente.emit('addProduct', { product, userId, userRole });
      alert('Producto Agregado Correctamente');
      form.reset(); // Restablecer los campos del formulario
    } else {
      alert('Error al agregar el producto.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
  // Emitir un evento "addProduct" al servidor con la información del nuevo producto
  // socketCliente.emit("addProduct", {product , userId , userRole});
});

//#ACTUALIZAR UN PRODUCTO

// Obtener referencia al formulario y agregar un evento para cuando se envíe
let updateForm = document.getElementById("updateForm");
updateForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evitar que el formulario recargue la página

  // Obtener valores de los campos del formulario
  let _id = updateForm.elements.productID.value
  let nombre = updateForm.elements.nombre.value;
  let stock = updateForm.elements.stock.value;
  let thumbnails = updateForm.elements.thumbnails.value;
  let precio = updateForm.elements.precio.value;
  let code = updateForm.elements.code.value;
  let categoria = updateForm.elements.categoria.value;

  // Crear un objeto solo con las propiedades definidas
  let productData = {};
  if (_id) productData._id = _id;
  if (nombre) productData.nombre = nombre;
  if (stock) productData.stock = stock;
  if (thumbnails) productData.thumbnail = thumbnails;
  if (precio) productData.precio = precio;
  if (code) productData.code = code;
  if (categoria) productData.categoria = categoria;

  // Crear un objeto con los datos del usuario
  let userData = {
    _id: userId,
    role: userRole
  }

  // Emitir un evento "updateProduct" al servidor con la información del producto y del usuario
  socketCliente.emit("updateProduct", productData, userData);
});


// Crear una instancia de socket.io cliente
const socketCliente = io();

// Escuchar eventos "productos" enviados por el servidor, en el cual recibiremos la lista de productos actualizada.
socketCliente.on("productos", (products) => {
  // console.log('socketCliente.on.productos', products);
  updateProductList(products);
});


// Escuchar el evento de producto actualizado
socketCliente.on('productUpdated', () => {
  alert('Producto Actualizado');
  updateForm.reset(); // Restablecer los campos del formulario
});


//# Borrar producto
const deleteButton = document.getElementById('delete-btn');
deleteButton.addEventListener('click', async () => {

  // obtenemos el input donde se ingresa el id
  let productId = document.getElementById('productID-delete').value;

  // Crear un objeto con los datos del usuario
  let userData = {
    _id: userId,
    role: userRole
  }

  try {
    // Crear una solicitud DELETE
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (response.status == 204) {
      socketCliente.emit('deleteProduct', productId, userData);
      alert('Producto eliminado correctamente!');
      document.getElementById('productID-delete').value = ""; // Restablecer el valor del input
    } else {
      alert('Error al eliminar el producto.');
    }

  } catch (error) {
    console.error('Error:', error);
  }

});


//ALERTAS DE ERRORES:
socketCliente.on('error', (errorMessage) => {
  alert(errorMessage);
});


//Escuchar eventos "updatedProducts" enviados por el servidor después de una actualización
socketCliente.on("updatedProducts", (obj) => {
  updateProductList(obj); // Llama a la función para actualizar la lista de productos en la página
});
