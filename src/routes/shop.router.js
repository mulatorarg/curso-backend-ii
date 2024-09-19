import { Router } from "express";
import { passportCall } from "../util/util.js";
import ProductModel from "../models/product.model.js";
import cartController from "../controller/cart.controller.js";
import CartDao from "../dao/cart.dao.js";

const router = Router();
const cartDao = new CartDao();

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

router.get("/categorias/:categoria", async (req, res) => {
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

router.get("/login", (req, res) => {
  //si tiene token, está logueado
  if (req.cookies["coderShopToken"]) {
    res.redirect("/api/sessions/current"); //esta ruta controla si token es correcto...
  } else {
    res.render("login");
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/sinpermisos", (req, res) => {
  res.render("sinpermisos");
});

router.get("/realtimeproducts", passportCall("jwt"), async (req, res) => {
  if (req.user.role !== "admin") {
    res.redirect("/sinpermisos");
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

router.get("/cart", passportCall("jwt"), async (req, res) => {
  try {

    if (req.user.role !== "user") res.redirect("/sinpermisos");

    const titulo = "🛒 Tu Carrito de compras";
    const categorias = await ProductModel.distinct("category").lean();

    const carrito_id = req.user.cart;
    const carrito = await cartDao.getCartById(carrito_id);

    let productos = [];
    if (carrito) productos = carrito.products;

    console.log(productos);

    res.render("cart", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar tu carrito: " + error)
  }
});

router.get("/product/:producto_id", passportCall("jwt"), async (req, res) => {
  try {
    if (req.user.role !== "user") res.redirect("/sinpermisos");

    const carrito_id = req.user.cart;
    if (carrito_id) {
      const producto_id = req.params.producto_id ?? '';
      const titulo = "Datos Producto";
      const producto = await ProductModel.findById(producto_id).lean();
      const categorias = await ProductModel.distinct("category").lean();
      res.render("product", { producto, categorias, titulo, carrito_id });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).send("Error al recuperar Producto.")
  }
});

router.get("/purchase/:producto_id", passportCall("jwt"), cartController.addProductToCart);

export default router;
