const socket = io();

const formAgregarProducto = document.getElementById('formAgregarProducto');
const formEditarProducto = document.getElementById('formEditarProducto');
const btnAgregarProducto = document.getElementById('btnAgregarProducto');
const btnEditarProducto = document.getElementById('btnEditarProducto');
const btnBorrarProducto = document.getElementById('btnBorrarProducto');

const lstProductos = document.getElementById('lstProductos');

function editarProducto(id, name, category, price, stock, thumbnail) {
  formEditarProducto.product_id.value = id;
  formEditarProducto.product_name.value = name;
  formEditarProducto.product_category.value = category;
  formEditarProducto.product_price.value = price;
  formEditarProducto.product_stock.value = stock;
  formEditarProducto.product_thumbnail.value = thumbnail;
}

function borrarProducto(id) {
  Swal.fire({
    title: "¿Estás seguro de eliminar el product?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit('borrarProducto', id);
    }
  });
}

function mostrarMsj(tipo = 'success', texto = 'Genial!') {
  Swal.fire({
    position: "top-end",
    icon: tipo,
    text: texto,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    confirmButtonText: "Aceptar"
  });
}

btnAgregarProducto.addEventListener('click', (e) => {

  if (formAgregarProducto.product_name.value.length == 0) return;
  if (formAgregarProducto.product_category.value.length == 0) return;
  if (formAgregarProducto.product_price.value.length == 0) return;
  if (formAgregarProducto.product_stock.value.length == 0) return;

  const datos = {
    name: formAgregarProducto.product_name.value,
    category: formAgregarProducto.product_category.value,
    price: formAgregarProducto.product_price.value,
    stock: formAgregarProducto.product_stock.value,
  };

  socket.emit('agregarProducto', datos);
});

btnEditarProducto.addEventListener('click', (e) => {

  if (formEditarProducto.product_id.value.length == 0) return;
  if (formEditarProducto.product_name.value.length == 0) return;
  if (formEditarProducto.product_category.value.length == 0) return;
  if (formEditarProducto.product_price.value.length == 0) return;
  if (formEditarProducto.product_stock.value.length == 0) return;
  //if (formEditarProducto.product_thumbnail.value.length == 0) return;

  const product = {
    id: formEditarProducto.product_id.value,
    name: formEditarProducto.product_name.value,
    category: formEditarProducto.product_category.value,
    price: formEditarProducto.product_price.value,
    stock: formEditarProducto.product_stock.value,
    //thumbnail: formEditarProducto.product_thumbnail.value,
  };

  socket.emit('editarProducto', product);
});

socket.on('agregarProductoAgregado', (product) => {
  mostrarMsj('success', `Se ha agregado un nuevo product: ${product.name}.`);

  const nuevoProductoCol = `<div id="product_${product._id}" class="col">
    <div class="card shadow-sm">
      <img src="../img/products/${product.thumbnails[0]}" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <p id="product_${product._id}_name" class="card-text">${product.name}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <a href="/product/${ product._id }" onclick="editarProducto('${product._id}', '${product.name}', '${product.category}', '${product.price}', '${product.stock}', '${product.thumbnail}')" class="btn btn-sm btn-success">Editar</a>
            <a href="/addproduct/${ product._id }" onclick="borrarProducto('${product._id}')" class="btn btn-sm btn-danger">Eliminar</a>
          </div>
          <small id="product_${product._id}_price" class="text-body-secondary">$ ${product.price}</small>
        </div>
      </div>
    </div>
  </div>`;
  lstProductos.innerHTML += nuevoProductoCol;
});

socket.on('editarProductoEditado', (product) => {
  mostrarMsj('success', `Se ha editado el product: ${product.name}.`);

  const elementoname = document.getElementById(`product_${product._id}_name`);
  if (elementoname) elementoname.innerHTML = product.name;

  const elementocategory = document.getElementById(`product_${product._id}_category`);
  if (elementocategory) elementocategory.innerHTML = product.category;

  const elementoPrecio = document.getElementById(`product_${product._id}_price`);
  if (elementoPrecio) elementoPrecio.innerHTML = `$ ${product.price}`;
});

socket.on('borrarProductoBorrado', (product) => {
  mostrarMsj('success', `Se ha eliminado un producto.`);

  const elemento = document.getElementById('product_' + product);
  if (elemento) {
    elemento.parentNode.removeChild(elemento);
  } else {
    console.log('Elemento no encontrado');
  }
});

socket.on('mostrarMsj', (data) => {
  mostrarMsj(data.tipo, data.mensaje);
});
