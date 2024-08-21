import { Router } from "express";
import ProductoModel from "../models/producto.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const titulo = "Todos nuestros Productos";
    const productos = await ProductoModel.find({ activo: true }).lean();
    const categorias = await ProductoModel.distinct("categoria").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
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
    const productos = await ProductoModel.find({categoria: categoria}).lean();
    const categorias = await ProductoModel.distinct("categoria").lean();
    res.render("store", { productos, categorias, titulo });
  } catch (error) {
    res.status(500).send("Error al recuperar Categorias.")
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

export default router;
