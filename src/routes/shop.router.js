import { Router } from "express";
import ProductoModel from "../models/producto.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const productos = await ProductoModel.find().lean();
    res.render("store", { productos });
  } catch (error) {
    res.status(500).send("Error al recuperar Productos.")
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

export default router;
