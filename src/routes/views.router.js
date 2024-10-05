import { Router } from "express";
import { passportCall } from "../util/util.js";
import ProductModel from "../models/product.model.js";
import cartController from "../controller/cart.controller.js";
import config from "../config/config.js";

const router = Router();

/** Renderizar vista de todos los productos */
router.get("/", async (req, res) => {
  try {
    const titulo = "Todos nuestros Productos";
    const productos = await ProductModel.find({ active: true }).lean();
    const categorias = await ProductModel.distinct("category").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Productos Activos.")
  }
});

/** Renderizar vista de los productos destacados */
router.get("/destacados", async (req, res) => {
  try {
    const titulo = "Productos Destacados";
    const productos = await ProductModel.find({ important: true, active: true }).lean();
    const categorias = await ProductModel.distinct("category").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Productos Destacados.")
  }
});

/** Renderizar vista de los productos según categoría */
router.get("/categorias/:category", async (req, res) => {
  try {
    const category = req.params.category ?? '';
    const titulo = "Productos por Categoria";
    const productos = await ProductModel.find({ active: true, category: category }).lean();
    const categorias = await ProductModel.distinct("category").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Categorias.")
  }
});

/** Renderizar vista de inicio de sesión */
router.get("/login", (req, res) => {
  //si tiene token, está logueado
  if (req.cookies[config.COOKIE_NAME]) {
    res.redirect("/api/sessions/current"); //esta ruta controla si token es correcto...
  } else {
    res.render("login");
  }
});

/** Renderizar vista de regsitro de usuario */
router.get("/register", (req, res) => {
  res.render("register");
});

/** Renderizar vista de información de que el usuario no tiene los permisos para acceder al recurso */
router.get("/sinpermisos", (req, res) => {
  res.render("sinpermisos");
});

/** Renderizar vista de ABM en tiempo real (uso de websockets) */
router.get("/realtimeproducts", passportCall("jwt"), async (req, res) => {
  if (req.user.role !== "admin") {
    res.redirect("/sinpermisos");
      console.log('RealtimeProducts: Sin Permisos.');
      return;
  }
  try {
    const titulo = "Productos en tiempo real 😏";
    const productos = await ProductModel.find({ active: true }).lean();
    const categorias = await ProductModel.distinct("category").lean();
    res.render("realtimeProducts", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Productos para Tiempo Real.")
  }
});

/** Renderizar vista del carrito actual del usuario */
router.get("/cart", passportCall("jwt"), cartController.showCart);

/** Renderizar vista de datos del producto seleccionado */
router.get("/product/:producto_id", passportCall("jwt"), cartController.showProduct);

/** Renderizar vista de compra de producto seleccionado */
router.get("/purchase/:producto_id", passportCall("jwt"), cartController.addProductToCart);

export default router;
