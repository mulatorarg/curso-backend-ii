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

import { jwtDecode } from "jwt-decode";

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

  socket.on('agregarProducto', async (data) => {
    // antes de nada, verifico si tiene permisos
    const cookie = socket.handshake.headers.cookie ?? '';
    const decoded = jwtDecode(cookie);
    const role = decoded.role;

    if (role !== 'admin') {
      socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'No tienes permisos para actualizar productos.' });
      return;
    }

    try {
      const producto = await productService.addProduct(data);

      if (producto) {
        socket.emit('agregarProductoAgregado', producto);
        //socket.emit('mostrarMsj', { tipo: 'success', mensaje: 'El producto fue cargado correctamente.' });
      } else {
        socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'El producto no fue cargado.' });
      }

    } catch (error) {
      console.log(error);
    }

  });

  socket.on('editarProducto', async (data) => {
    // antes de nada, verifico si tiene permisos
    const cookie = socket.handshake.headers.cookie ?? '';
    const decoded = jwtDecode(cookie);
    const role = decoded.role;

    if (role !== 'admin') {
      socket.emit('mostrarMsj', { tipo: 'error', mensaje: 'No tienes permiso para actualizar este producto.' });
      return;
    }

    const productoId = data.id;
    delete data.id;

    const producto = await productService.updateProduct(productoId, data);

    socket.emit('editarProductoEditado', producto);
  });

  socket.on('borrarProducto', async (productoId) => {
    const producto = await productService.deleteProduct(productoId);
    console.log(producto);
    socket.emit('borrarProductoBorrado', productoId);
  });

});
