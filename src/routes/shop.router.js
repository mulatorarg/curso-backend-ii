import { Router } from "express";
import ProductoModel from "../models/producto.model.js";
import { soloAdmin, soloUser } from "../middleware/auth.js";
import passport from "passport";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const titulo = "Todos nuestros Productos";
    const productos = await ProductoModel.find({ activo: true }).lean();
    const categorias = await ProductoModel.distinct("categoria").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Productos Activos.")
  }
});

router.get("/destacados", async (req, res) => {
  try {
    const titulo = "Productos Destacados";
    const productos = await ProductoModel.find({ destacado: true, activo: true }).lean();
    const categorias = await ProductoModel.distinct("categoria").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Productos Destacados.")
  }
});

router.get("/categorias/:categoria", async (req, res) => {
  try {
    const categoria = req.params.categoria ?? '';
    const titulo = "Productos por Categoria";
    const productos = await ProductoModel.find({ categoria: categoria }).lean();
    const categorias = await ProductoModel.distinct("categoria").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Categorias.")
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await cartManager.getCarritoById(cartId);

    if (!carrito) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productosEnCarrito = carrito.products.map(item => ({
      product: item.product.toObject(),
      quantity: item.quantity
    }));

    res.render("carts", { productos: productosEnCarrito });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), soloAdmin, (req, res) => {
  res.render("realtime-products");
})

export default router;
