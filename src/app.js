import express from "express";
import exphbs from "express-handlebars";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.router.js";
import sessionRouter from "./routes/session.router.js";
import shopRouter from "./routes/shop.router.js";
import { Server } from "socket.io";
import productService from "./services/product.service.js";
import "./config/database.js";

const app = express();
const PUERTO = 8080;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize());

initializePassport();

// Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/", shopRouter);
app.use("/productos", productRouter);
app.use("/api/sessions", sessionRouter);

// Iniciamos servidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}.`);
});

const socketServer = new Server(httpServer);

// Configurar el evento de conexión de Socket.IO

socketServer.on('connection', async (socket) => {

  console.log("nuevo cliente conectado")

  //websockets para Productos:

  const products = await productService.getProducts()
  socket.emit('productos', products); //enviamos al cliente un array con todos los productos.

  //#ADD PRODUCT:
  //recibimos informacion del cliente, en este caso un nuevo producto y lo agregamos a nuestra base de datos.
  socket.on('addProduct', async data => {

      // const product = data.product;
      // const userId = data.userId;
      // const userRole = data.userRole

      // //caso que el administrador quiera crear un producto
      // if (!userId && userRole === 'admin') {
      //     await productService.addProduct(product)
      //     const updateProductsList = await productService.getProducts();
      //     socket.emit('updatedProducts', updateProductsList ); //le enviamos al cliente la lista de productos actualizada con el producto que anteriormente agrego.
      //     socket.emit('productAdded'); //para el manejo de alertas
      //     return;
      // }

      // //caso que un usuario cree un producto
      // const user = await userService.getUserById(userId);
      // if(user) product.owner = user._id

      // await productService.addProduct(product)
      // const updateProductsList = await productService.getProducts();
      // socket.emit('updatedProducts', updateProductsList ); //le enviamos al cliente la lista de productos actualizada con el producto que anteriormente agrego.
      // socket.emit('productAdded'); //para el manejo de alertas

      const updateProductsList = await productService.getProducts();
      socket.emit('updatedProducts', updateProductsList ); //le enviamos al cliente la lista de productos actualizada con el producto que anteriormente agrego.
      socket.emit('productAdded'); //para el manejo de alertas
  })

  //#UPDATE PRODUCT:
  socket.on('updateProduct', async (productData, userData) => {
      const idProduct = productData._id;
      delete productData._id; // Eliminar el _id del objeto para evitar errores

      // Obtener el producto de la base de datos
      const product = await productService.getProductById(idProduct);

      // Verificar si el usuario es el propietario del producto o es un administrador
      if (userData.role === 'admin' || product.owner === userData._id) {

          // Actualizar el producto en la base de datos
          await productService.updateProduct(idProduct, { $set: productData });

          const updateProductsList = await productService.getProducts();
          socket.emit('updatedProducts', updateProductsList ); //le enviamos al cliente la lista de productos actualizada con el producto que anteriormente agrego.
          socket.emit('productUpdated');//para el manejor de alertas
      } else {
          // Enviar un mensaje de error al cliente
          socket.emit('error',  'No tienes permiso para actualizar este producto.' );
      }
  });


  //#DELETE PRODUCT:
  //recibimos del cliente el id del producto a eliminar
  socket.on('deleteProduct', async (productId , userData) => {

      const updateProducts = await productService.getProducts(); //obtenemos la lista actualizada con el producto eliminado
      socket.emit('updatedProducts', updateProducts ); //le enviamos al cliente la lista actualizada

      // // Obtenemos el producto
      // const product = await productService.getProductById(productId);

      // if (product === null) {
      //     socket.emit('error', 'Producto no encontrado');
      // }
      // // Verificamos si el usuario es el propietario del producto o si es admin
      // else if (userData.role === 'admin' || product.owner === userData._id) {
      //     await productService.deleteProduct(productId); //eliminamos el producto
      //     const updateProducts = await productService.getProducts(); //obtenemos la lista actualizada con el producto eliminado
      //     socket.emit('updatedProducts', updateProducts ); //le enviamos al cliente la lista actualizada
      //     socket.emit('productDeleted')//para el manejo de alertas
      // } else {
      //     socket.emit('error', 'No tienes permiso para eliminar este producto');
      // }
  })

})





//websockets para el chat:

socketServer.on('connection', async (socket) => {

  console.log("nuevo cliente conectado 2")


  //recibimos el nombre del usuario que se registro:
  socket.on('authenticated', data => {
      console.log(data)
      socket.broadcast.emit('newUserConnected', data);
  })


  //recibimos el usuario con su mensaje
  socket.on('message', async data => {
      console.log(data)
      const addMessage = await messageService.addMessages(data); //agregamos el mensaje del usuario a la base de datos.
      const messages = await messageService.getMessages(); //obtenemos todos los mensajes de la base de datos.
      socket.emit('messageLogs', messages); //enviamos al cliente la lista de todos los mensajes (array).
  })
});
