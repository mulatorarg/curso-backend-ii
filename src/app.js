import express from "express";
import exphbs from "express-handlebars";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.router.js";
import sessionRouter from "./routes/session.router.js";
import shopRouter from "./routes/shop.router.js";

import "./database.js";

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
app.use("/admin", adminRouter);
app.use("/api/sessions", sessionRouter);

// Iniciamos servidor
app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}.`);
});
